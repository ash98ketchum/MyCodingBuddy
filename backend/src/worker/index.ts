import { submissionQueue } from '@/services/judge.service';
import prisma from '@/config/database';
import { executeCode } from './executor';

submissionQueue.process(3, async (job) => {
  const { submissionId, code, language, testCases, timeLimit, memoryLimit } = job.data;

  console.log(`🔄 Processing submission ${submissionId}`);

  try {
    let passedTests = 0;
    let totalExecutionTime = 0;
    let maxMemoryUsed = 0;
    let verdict = 'ACCEPTED';
    let errorMessage = '';

    // Run against all test cases
    for (const testCase of testCases) {
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

        if (actualOutput === expectedOutput) {
          passedTests++;
        } else {
          verdict = 'WRONG_ANSWER';
          errorMessage = `Test case failed. Expected: ${expectedOutput}, Got: ${actualOutput}`;
          break;
        }
      } catch (error: any) {
        if (error.message.includes('TIMEOUT')) {
          verdict = 'TIME_LIMIT_EXCEEDED';
          errorMessage = 'Code execution exceeded time limit';
        } else if (error.message.includes('MEMORY')) {
          verdict = 'MEMORY_LIMIT_EXCEEDED';
          errorMessage = 'Code execution exceeded memory limit';
        } else if (error.message.includes('COMPILATION')) {
          verdict = 'COMPILATION_ERROR';
          errorMessage = error.message;
        } else {
          verdict = 'RUNTIME_ERROR';
          errorMessage = error.message;
        }
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
        executionTime: Math.round(totalExecutionTime / testCases.length),
        memoryUsed: maxMemoryUsed,
        testCasesPassed: passedTests,
        score,
        errorMessage: errorMessage || null,
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
        const ratingChange = calculateRatingChange(
          submission.user.rating,
          submission.problem.rating,
          true
        );

        await prisma.user.update({
          where: { id: submission.userId },
          data: {
            rating: { increment: ratingChange },
            streak: { increment: 1 },
            lastSolvedAt: new Date(),
          },
        });
      }
    }

    console.log(`✅ Submission ${submissionId} completed: ${verdict}`);

    return {
      submissionId,
      verdict,
      score,
    };
  } catch (error) {
    console.error(`❌ Error processing submission ${submissionId}:`, error);

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
