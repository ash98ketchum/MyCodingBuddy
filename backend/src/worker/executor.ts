import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';

interface ExecutionResult {
  output: string;
  executionTime: number;
  memoryUsed: number;
}

const TEMP_DIR = '/tmp/judge';

// Ensure temp directory exists
async function ensureTempDir() {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create temp directory:', error);
  }
}

ensureTempDir();

export async function executeCode(
  code: string,
  language: string,
  input: string,
  timeLimit: number,
  memoryLimit: number
): Promise<ExecutionResult> {
  const jobId = randomUUID();
  const jobDir = path.join(TEMP_DIR, jobId);

  try {
    // Create job directory
    await fs.mkdir(jobDir, { recursive: true });

    let result: ExecutionResult;

    switch (language) {
      case 'JAVASCRIPT':
        result = await executeJavaScript(code, input, jobDir, timeLimit);
        break;
      case 'PYTHON':
        result = await executePython(code, input, jobDir, timeLimit);
        break;
      case 'JAVA':
        result = await executeJava(code, input, jobDir, timeLimit);
        break;
      case 'CPP':
        result = await executeCpp(code, input, jobDir, timeLimit);
        break;
      case 'C':
        result = await executeC(code, input, jobDir, timeLimit);
        break;
      default:
        throw new Error('Unsupported language');
    }

    return result;
  } finally {
    // Cleanup
    try {
      await fs.rm(jobDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
}

async function executeJavaScript(
  code: string,
  input: string,
  jobDir: string,
  timeLimit: number
): Promise<ExecutionResult> {
  const fileName = path.join(jobDir, 'solution.js');
  await fs.writeFile(fileName, code);

  return runCommand('node', [fileName], input, timeLimit);
}

async function executePython(
  code: string,
  input: string,
  jobDir: string,
  timeLimit: number
): Promise<ExecutionResult> {
  const fileName = path.join(jobDir, 'solution.py');
  await fs.writeFile(fileName, code);

  return runCommand('python3', [fileName], input, timeLimit);
}

async function executeJava(
  code: string,
  input: string,
  jobDir: string,
  timeLimit: number
): Promise<ExecutionResult> {
  const fileName = path.join(jobDir, 'Solution.java');
  await fs.writeFile(fileName, code);

  // Compile
  await runCommand('javac', [fileName], '', 10000);

  // Execute
  return runCommand('java', ['-cp', jobDir, 'Solution'], input, timeLimit);
}

async function executeCpp(
  code: string,
  input: string,
  jobDir: string,
  timeLimit: number
): Promise<ExecutionResult> {
  const sourceFile = path.join(jobDir, 'solution.cpp');
  const outputFile = path.join(jobDir, 'solution');

  await fs.writeFile(sourceFile, code);

  // Compile
  await runCommand('g++', [sourceFile, '-o', outputFile, '-std=c++17'], '', 10000);

  // Execute
  return runCommand(outputFile, [], input, timeLimit);
}

async function executeC(
  code: string,
  input: string,
  jobDir: string,
  timeLimit: number
): Promise<ExecutionResult> {
  const sourceFile = path.join(jobDir, 'solution.c');
  const outputFile = path.join(jobDir, 'solution');

  await fs.writeFile(sourceFile, code);

  // Compile
  await runCommand('gcc', [sourceFile, '-o', outputFile], '', 10000);

  // Execute
  return runCommand(outputFile, [], input, timeLimit);
}

function runCommand(
  command: string,
  args: string[],
  input: string,
  timeLimit: number
): Promise<ExecutionResult> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let output = '';
    let errorOutput = '';
    let killed = false;

    const process = spawn(command, args, {
      timeout: timeLimit,
      killSignal: 'SIGKILL',
    });

    // Timeout handler
    const timer = setTimeout(() => {
      killed = true;
      process.kill('SIGKILL');
      reject(new Error('TIMEOUT: Execution time limit exceeded'));
    }, timeLimit);

    // Write input
    if (input) {
      process.stdin.write(input);
      process.stdin.end();
    }

    // Capture output
    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      clearTimeout(timer);

      if (killed) {
        return;
      }

      const executionTime = Date.now() - startTime;

      if (code !== 0) {
        if (errorOutput.includes('error') || errorOutput.includes('Error')) {
          reject(new Error(`COMPILATION_ERROR: ${errorOutput}`));
        } else {
          reject(new Error(`RUNTIME_ERROR: ${errorOutput || 'Process exited with code ' + code}`));
        }
      } else {
        resolve({
          output: output.trim(),
          executionTime,
          memoryUsed: Math.floor(Math.random() * 50) + 10, // Simulated memory usage
        });
      }
    });

    process.on('error', (err) => {
      clearTimeout(timer);
      reject(new Error(`RUNTIME_ERROR: ${err.message}`));
    });
  });
}
