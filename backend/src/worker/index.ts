// backend/src/worker/index.ts
import { submissionQueue } from '@/services/judge.service';
import prisma from '@/config/database';
// import { Verdict } from '@prisma/client';
import { Verdict } from '@prisma/client';
import { executeBatch } from './executor';
import { AssignmentService } from '@/services/assignment.service';

submissionQueue.process(3, async (job) => {
  const { submissionId, code, language, testCases, timeLimit, memoryLimit } = job.data;

  console.log(`🔄 Processing submission ${submissionId} `);

  try {
    const { results } = await executeBatch(code, language, testCases);

    let passedTests = 0;
    let totalExecutionTime = 0;
    let maxMemoryUsed = 0;
    let verdict: Verdict = Verdict.ACCEPTED;
    let errorMessage = '';
    const testResults: any[] = [];

    // Process results
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const testCase = testCases[i];
      const statusId = result.status.id;

      const isPassed = statusId === 3; // Accepted
      const executionTime = parseFloat(result.time) * 1000 || 0; // Judge0 returns seconds
      const memoryUsed = result.memory || 0; // Judge0 returns KB

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
        // Only set the first error as the main verdict
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
        testResults: JSON.stringify(testResults),
      },
    });

    // Update problem stats
    await prisma.problem.update({
      where: { id: job.data.problemId },
      data: {
        submissionCount: { increment: 1 },
        ...(verdict === Verdict.ACCEPTED && {
          acceptedCount: { increment: 1 },
        }),
      },
    });

    // Update user rating if accepted
    if (verdict === Verdict.ACCEPTED) {
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

        // Mark daily assignment as solved
        try {
          await AssignmentService.markAsSolved(submission.userId, job.data.problemId, submissionId);
        } catch (err) {
          console.error('Failed to update daily assignment status', err);
        }
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
        verdict: Verdict.RUNTIME_ERROR,
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
