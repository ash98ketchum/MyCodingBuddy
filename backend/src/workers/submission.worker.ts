// backend/src/workers/submission.worker.ts
//
// Submission job processor.
// Reads jobs from the Bull queue, submits each test case to the self-hosted
// Judge0 instance via the centralised judge0Client service, evaluates results,
// and writes the final verdict to the database + emits it over WebSocket.

import { submissionQueue } from '@/services/judge.service';
import { judge0Client, JUDGE0_STATUS, Judge0Result } from '@/services/judge0Client.service';
import prisma from '@/config/database';
import { Verdict } from '@prisma/client';
import { getSocketIO } from '@/socket';
import { problemLoader } from '@/services/problemLoader.service';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Trim trailing whitespace/newlines for deterministic comparison */
const normalizeOutput = (s: string | null | undefined): string => {
    if (!s) return '';
    return s
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n')
        .trimEnd();
};

/** Map our language enum → Judge0 language name */
function verdictFromStatusId(
    statusId: number,
    result: Judge0Result,
    testCaseIndex: number
): { verdict: Verdict; errorMessage: string } {
    if (statusId === JUDGE0_STATUS.WRONG_ANSWER) {
        return { verdict: Verdict.WRONG_ANSWER, errorMessage: `Test case ${testCaseIndex + 1} failed` };
    }
    if (statusId === JUDGE0_STATUS.TIME_LIMIT) {
        return { verdict: Verdict.TIME_LIMIT_EXCEEDED, errorMessage: `Test case ${testCaseIndex + 1}: Time limit exceeded` };
    }
    if (statusId === JUDGE0_STATUS.COMPILATION_ERROR) {
        return {
            verdict: Verdict.COMPILATION_ERROR,
            errorMessage: result.compile_output || result.stderr || 'Compilation failed',
        };
    }
    // Status 7–12 are various runtime error subtypes
    if (statusId >= JUDGE0_STATUS.RUNTIME_ERROR_MIN && statusId <= JUDGE0_STATUS.RUNTIME_ERROR_MAX) {
        const detail = (result.stderr || result.message || result.status.description).trim();
        return { verdict: Verdict.RUNTIME_ERROR, errorMessage: detail };
    }
    // Catch-all for unexpected statuses
    const detail = (result.stderr || result.message || result.status.description).trim();
    return { verdict: Verdict.RUNTIME_ERROR, errorMessage: detail };
}

// ── Worker ────────────────────────────────────────────────────────────────────

submissionQueue.process(async (job: any) => {
    const { submissionId, code, language, sampleOnly } = job.data;

    // ── Guard: verify submission still exists ─────────────────────────────────
    const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: { problem: { select: { slug: true } } },
    });

    if (!submission) {
        console.warn(`⚠️  [Worker] Submission ${submissionId} not found — skipping stale job`);
        return;
    }

    const { slug } = submission.problem;
    console.log(`🔄 [Worker] Processing ${submissionId} | problem: ${slug} | lang: ${language} | sample: ${!!sampleOnly}`);

    // ── Load test cases ───────────────────────────────────────────────────────
    const testCasesToRun = sampleOnly
        ? problemLoader.getSampleTestCases(slug)
        : problemLoader.getHiddenTestCases(slug);

    if (testCasesToRun.length === 0) {
        const errMsg = `No test cases found for problem: ${slug}`;
        console.error(`❌ [Worker] ${errMsg}`);
        await prisma.submission.update({
            where: { id: submissionId },
            data: { verdict: Verdict.RUNTIME_ERROR, errorMessage: errMsg },
        });
        return;
    }

    const io = getSocketIO();

    // ── Run all test cases through Judge0 (batch-first, wait fallback) ─────────
    let executionResults: Judge0Result[];
    try {
        executionResults = await judge0Client.runBatch(code, language, testCasesToRun);
        console.log(`📤 [Worker] Got ${executionResults.length} results from Judge0 for ${submissionId}`);
    } catch (err: any) {
        const errMsg = `Judge0 execution failed: ${err?.message}`;
        console.error(`❌ [Worker] ${errMsg}`);
        await prisma.submission.update({
            where: { id: submissionId },
            data: { verdict: Verdict.RUNTIME_ERROR, errorMessage: errMsg },
        });
        if (io) {
            io.to(`submission_${submissionId}`).emit('submission:completed', {
                submissionId, verdict: Verdict.RUNTIME_ERROR, error: errMsg,
            });
        }
        return;
    }

    // ── Evaluate results ──────────────────────────────────────────────────────
    let passedTests = 0;
    let totalTime = 0;
    let maxMemory = 0;
    let finalVerdict: Verdict = Verdict.ACCEPTED;
    let finalErrorMsg = '';
    const testResults: any[] = [];

    const isDebug = process.env.JUDGE_DEBUG === 'true';

    for (let i = 0; i < executionResults.length; i++) {
        const result = executionResults[i];
        const testCase = testCasesToRun[i];
        const statusId = result.status.id;

        const normalizedGot = normalizeOutput(result.stdout);
        const normalizedExpected = normalizeOutput(testCase.expectedOutput);
        const isPassed = statusId === JUDGE0_STATUS.ACCEPTED && normalizedGot === normalizedExpected;

        const execTime = parseFloat(result.time ?? '0') * 1000 || 0; // ms
        const memUsed = result.memory ?? 0; // KB

        totalTime += execTime;
        maxMemory = Math.max(maxMemory, memUsed);

        if (isDebug) {
            console.log(`[Judge0 Debug] Case ${i + 1}: status=${statusId} passed=${isPassed} time=${execTime}ms`);
            if (!isPassed && result.stderr) console.log(`  stderr: ${result.stderr.slice(0, 200)}`);
            if (!isPassed && result.compile_output) console.log(`  compile: ${result.compile_output.slice(0, 200)}`);
        }

        const testCaseError = result.stderr || result.message || '';

        const testResult: any = {
            testCaseNumber: i + 1,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: result.stdout?.trim() ?? '',
            passed: isPassed,
            executionTime: execTime,
            memoryUsed: memUsed,
            error: testCaseError || undefined,
        };

        if (isPassed) {
            passedTests++;
        } else if (finalVerdict === Verdict.ACCEPTED) {
            // Lock in the first failing verdict
            const { verdict, errorMessage } = verdictFromStatusId(statusId, result, i);
            finalVerdict = verdict;
            finalErrorMsg = errorMessage;
        }

        testResults.push(testResult);
    }

    const score = Math.round((passedTests / testCasesToRun.length) * 100);

    // ── Persist to DB ─────────────────────────────────────────────────────────
    await prisma.submission.update({
        where: { id: submissionId },
        data: {
            verdict: finalVerdict,
            executionTime: Math.round(totalTime / Math.max(passedTests, 1)),
            memoryUsed: maxMemory,
            testCasesPassed: passedTests,
            score,
            stdout: executionResults[0]?.stdout ?? null,
            stderr: executionResults[0]?.stderr ?? null,
            compileOutput: executionResults[0]?.compile_output ?? null,
            errorMessage: finalErrorMsg || null,
            testResults: testResults as any,
        },
    });

    console.log(`🏁 [Worker] ${submissionId} done — ${finalVerdict} (${passedTests}/${testCasesToRun.length})`);

    // ── Emit WebSocket event ──────────────────────────────────────────────────
    const payload = {
        submissionId,
        verdict: finalVerdict,
        executionTime: totalTime,
        memoryUsed: maxMemory,
        score,
        passedTests,
        totalTestCases: testCasesToRun.length,
    };

    if (io) {
        io.to(`submission_${submissionId}`).emit('submission:completed', payload);
        io.to(`submission_${submissionId}`).emit('submission_complete', payload); // legacy alias
        console.log(`📡 [Worker] Emitted submission:completed for ${submissionId}`);
    } else {
        console.warn('⚠️  [Worker] Socket.IO not initialized — skipping WebSocket emit');
    }
});

console.log('🚀 [Worker] Submission Worker Started');
