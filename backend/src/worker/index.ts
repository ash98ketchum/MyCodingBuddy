// backend/src/worker/index.ts
import { submissionQueue } from '@/services/judge.service';
import prisma from '@/config/database';
import { Verdict } from '@prisma/client';
import { executeCode } from './executor';

submissionQueue.process(3, async (job) => {
  const { submissionId, code, language, testCases, timeLimit, memoryLimit } = job.data;

  console.log(`🔄 Processing submission ${submissionId} `);

  try {
    let passedTests = 0;
    let totalExecutionTime = 0;
    let maxMemoryUsed = 0;
    let verdict: Verdict = 'ACCEPTED';
    let errorMessage = '';
    const testResults: any[] = [];

    // Run against all test cases
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const testResult: any = {
        testCaseNumber: i + 1,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        passed: false,
      };

      try {
        const result = await executeCode(
          code,
          language,
          testCase.input,
          timeLimit,
          memoryLimit
        );

        totalExecutionTime += result.executionTime;
        maxMemoryUsed = Math.max(maxMemoryUsed, result.memoryUsed);

        // Check output
        const actualOutput = result.output.trim();
        const expectedOutput = testCase.expectedOutput.trim();

        testResult.actualOutput = actualOutput;
        testResult.executionTime = result.executionTime;
        testResult.memoryUsed = result.memoryUsed;

        if (actualOutput === expectedOutput) {
          passedTests++;
          testResult.passed = true;
        } else {
          verdict = 'WRONG_ANSWER';
          errorMessage = `Test case ${i + 1} failed`;
        }
      } catch (error: any) {
        testResult.actualOutput = '';
        testResult.error = error.message;

        if (error.message.includes('TIMEOUT')) {
          verdict = 'TIME_LIMIT_EXCEEDED';
          errorMessage = `Test case ${i + 1}: Time limit exceeded`;
        } else if (error.message.includes('MEMORY')) {
          verdict = 'MEMORY_LIMIT_EXCEEDED';
          errorMessage = `Test case ${i + 1}: Memory limit exceeded`;
        } else if (error.message.includes('COMPILATION')) {
          verdict = 'COMPILATION_ERROR';
          errorMessage = error.message;
        } else {
          verdict = 'RUNTIME_ERROR';
          errorMessage = `Test case ${i + 1}: ${error.message} `;
        }
      }

      testResults.push(testResult);

      // Stop on first failure for non-accepted verdicts
      if (verdict !== 'ACCEPTED') {
        break;
      }
    }

    // Calculate score
    const score = Math.round((passedTests / testCases.length) * 100);

    // Update submission in database
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        verdict,
        executionTime: Math.round(totalExecutionTime / Math.max(passedTests, 1)),
        memoryUsed: maxMemoryUsed,
        testCasesPassed: passedTests,
        score,
        errorMessage: errorMessage || null,
        testResults: testResults,
      },
    });

    // Update problem stats
    await prisma.problem.update({
      where: { id: job.data.problemId },
      data: {
        submissionCount: { increment: 1 },
        ...(verdict === 'ACCEPTED' && {
          acceptedCount: { increment: 1 },
        }),
      },
    });

    // Update user rating if accepted
    if (verdict === 'ACCEPTED') {
      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
          problem: true,
          user: true,
        },
      });

      if (submission) {
        const currentRating = submission.user.rating || 1200;
        const currentStreak = submission.user.streak || 0;

        const ratingChange = calculateRatingChange(
          currentRating,
          submission.problem.rating,
          true
        );

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

    console.log(`✅ Submission ${submissionId} completed: ${verdict} `);

    return {
      submissionId,
      verdict,
      score,
    };
  } catch (error) {
    console.error(`❌ Error processing submission ${submissionId}: `, error);

    // Update submission with error
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        verdict: 'RUNTIME_ERROR',
        errorMessage: 'Internal judge error. Please try again.',
      },
    });

    throw error;
  }
});

// Rating calculation (simplified Elo-like system)
function calculateRatingChange(userRating: number, problemRating: number, solved: boolean): number {
  const K = 32; // K-factor
  const expectedScore = 1 / (1 + Math.pow(10, (problemRating - userRating) / 400));
  const actualScore = solved ? 1 : 0;

  return Math.round(K * (actualScore - expectedScore));
}

console.log('🚀 Judge worker started');
