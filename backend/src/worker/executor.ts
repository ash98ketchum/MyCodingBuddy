import { judge0, ExecutionResponse } from './judge0';

export interface BatchExecutionResult {
  results: ExecutionResponse[];
}

export async function executeBatch(
  code: string,
  language: string,
  testCases: any[]
): Promise<BatchExecutionResult> {
  // 1. Submit batch
  const tokens = await judge0.submitBatch(code, language, testCases);

  // 2. Poll for results
  let results: ExecutionResponse[] = [];
  let completed = false;
  const startTime = Date.now();
  const POLL_INTERVAL = 2000;
  const TIMEOUT = 30000; // 30s global timeout

  while (!completed) {
    if (Date.now() - startTime > TIMEOUT) {
      throw new Error('Execution timed out waiting for Judge0');
    }

    results = await judge0.getBatchResults(tokens);

    // Check if all are finished (Status ID >= 3 means finished: Accepted, WA, RE, etc.)
    // 1: In Queue, 2: Processing
    const allFinished = results.every(r => r.status.id >= 3);

    if (allFinished) {
      completed = true;
    } else {
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    }
  }

  return { results };
}

