// backend/src/worker/index.ts
import { submissionQueue, resultCheckQueue, ResultCheckJob } from '@/services/judge.service';
import prisma from '@/config/database';
import { Verdict } from '@prisma/client';
import { judge0 } from './judge0';

// 1. Initial submission job
submissionQueue.process(5, async (job) => {
  const { submissionId, code, language, testCases } = job.data;
  console.log(`🔄 Submitting job ${submissionId} to Judge0 `);

  try {
    const tokens = await judge0.submitBatch(code, language, testCases);

    // Add to result check queue (async polling)
    await resultCheckQueue.add({
      submissionId,
      tokens,
      originalJobData: job.data,
      startTime: Date.now()
    });

    console.log(`✅ Submitted to Judge0. Tokens: ${tokens.length}. Async polling started.`);
  } catch (error) {
    console.error(`❌ Error submitting ${submissionId} to Judge0: `, error);
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        verdict: Verdict.RUNTIME_ERROR,
        errorMessage: 'Failed to submit to judge. Please try again.',
      },
    });
    throw error;
  }
});

// 2. Async polling job
resultCheckQueue.process(10, async (job) => {
  const { submissionId, tokens, originalJobData, startTime } = job.data as ResultCheckJob;
  const { testCases } = originalJobData;

  // Global timeout of 30 seconds
  if (Date.now() - startTime > 30000) {
    console.warn(`⏳ Job ${submissionId} timed out after 30s`);
    await prisma.submission.update({
      where: { id: submissionId },
      data: { verdict: Verdict.RUNTIME_ERROR, errorMessage: 'Execution timed out waiting for Judge0' },
    });
    return;
  }

  const results = await judge0.getBatchResults(tokens);

  // Status ID >= 3 means finished: Accepted, WA, RE, etc.
  const allFinished = results.every(r => r.status.id >= 3);

  if (!allFinished) {
    // Throw an error so Bull retries the job (it will retry based on the backoff config)
    throw new Error('Not all results are finished yet. Retrying...');
  }

  // ALL FINISHED - PROCESS RESULTS
  console.log(`✅ Job ${submissionId} evaluation complete at Judge0. Computing verdict...`);

  let passedTests = 0;
  let totalExecutionTime = 0;
  let maxMemoryUsed = 0;
  let verdict: Verdict = Verdict.ACCEPTED;
  let errorMessage = '';
  const testResults: any[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const testCase = testCases[i];
    const statusId = result.status.id;
    const isPassed = statusId === 3;
    const executionTime = parseFloat(result.time) * 1000 || 0;
    const memoryUsed = result.memory || 0;

    totalExecutionTime += executionTime;
    maxMemoryUsed = Math.max(maxMemoryUsed, memoryUsed);

    const testResult: any = {
      testCaseNumber: i + 1,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: result.stdout ? result.stdout.trim() : '',
      passed: isPassed,
      executionTime,
      memoryUsed,
    };

    if (isPassed) {
      passedTests++;
    } else {
      if (verdict === Verdict.ACCEPTED) {
        if (statusId === 4) {
          verdict = Verdict.WRONG_ANSWER;
          errorMessage = `Test case ${i + 1} failed`;
        } else if (statusId === 5) {
          verdict = Verdict.TIME_LIMIT_EXCEEDED;
          errorMessage = `Test case ${i + 1}: Time limit exceeded`;
        } else if (statusId === 6) {
          verdict = Verdict.COMPILATION_ERROR;
          errorMessage = result.compile_output || result.stderr || 'Compilation failed';
        } else if (statusId >= 7 && statusId <= 12) {
          verdict = Verdict.RUNTIME_ERROR;
          errorMessage = `Test case ${i + 1}: ${result.status.description}`;
          testResult.error = result.stderr || result.message;
        } else {
          verdict = Verdict.RUNTIME_ERROR;
          errorMessage = `Test case ${i + 1}: ${result.status.description}`;
        }
      }
    }

    testResults.push(testResult);
  }

  const score = Math.round((passedTests / testCases.length) * 100);

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      verdict,
      executionTime: Math.round(totalExecutionTime / Math.max(passedTests, 1)),
      memoryUsed: maxMemoryUsed,
      testCasesPassed: passedTests,
      score,
      errorMessage: errorMessage || null,
      testResults: testResults as any,
    },
  });

  await prisma.problem.update({
    where: { id: originalJobData.problemId },
    data: {
      submissionCount: { increment: 1 },
      ...(verdict === Verdict.ACCEPTED && {
        acceptedCount: { increment: 1 },
      }),
    },
  });

  if (verdict === Verdict.ACCEPTED) {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { problem: true, user: true },
    });

    if (submission) {
      const currentRating = submission.user.rating || 1200;
      const currentStreak = submission.user.streak || 0;
      const ratingChange = calculateRatingChange(currentRating, submission.problem.rating, true);

      await prisma.user.update({
        where: { id: submission.userId },
        data: {
          rating: currentRating + ratingChange,
          streak: currentStreak + 1,
          lastSolvedAt: new Date(),
        },
      });
    }
  }

  console.log(`🏁 Async Check Finished: Submission ${submissionId} completed with Verdict: ${verdict}`);
});

function calculateRatingChange(userRating: number, problemRating: number, solved: boolean): number {
  const K = 32;
  const expectedScore = 1 / (1 + Math.pow(10, (problemRating - userRating) / 400));
  const actualScore = solved ? 1 : 0;
  return Math.round(K * (actualScore - expectedScore));
}

console.log('🚀 Decoupled Async Judge worker listening for submissions');
