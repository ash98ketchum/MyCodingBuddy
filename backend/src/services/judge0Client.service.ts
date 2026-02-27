// backend/src/services/judge0Client.service.ts
//
// Centralised Judge0 HTTP client for the self-hosted Judge0 CE instance.

import axios, { AxiosInstance } from 'axios';
import { config } from '@/config';

// ── Language map ──────────────────────────────────────────────────────────────
export const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
    JAVASCRIPT: 63, // Node.js 12.14.0
    PYTHON: 71, // Python 3.8.1
    JAVA: 62, // OpenJDK 13.0.1
    CPP: 54, // C++ (GCC 9.2.0)
    C: 50, // C   (GCC 9.2.0)
};

// ── Status ID reference ───────────────────────────────────────────────────────
export const JUDGE0_STATUS = {
    IN_QUEUE: 1,
    PROCESSING: 2,
    ACCEPTED: 3,
    WRONG_ANSWER: 4,
    TIME_LIMIT: 5,
    COMPILATION_ERROR: 6,
    RUNTIME_ERROR_MIN: 7,
    RUNTIME_ERROR_MAX: 12,
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Judge0SubmissionPayload {
    source_code: string;
    language_id: number;
    stdin?: string;
    expected_output?: string;
    cpu_time_limit?: number;  // seconds
    memory_limit?: number;    // KB
}

export interface Judge0StatusResult {
    id: number;
    description: string;
}

export interface Judge0Result {
    token: string;
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    message: string | null;
    exit_code: number | null;
    exit_signal: number | null;
    status: Judge0StatusResult;
    time: string | null;    // seconds as string e.g. "0.003"
    memory: number | null;  // KB
}

export interface TestCaseInput {
    input: string;
    expectedOutput: string;
}

// Polling constants
const POLL_INTERVAL_MS = 1_500;
const MAX_POLL_ATTEMPTS = 30; // 30 × 1.5s = 45s max

// ── Helpers ───────────────────────────────────────────────────────────────────
const toBase64 = (s: string | null | undefined) => Buffer.from(s || '').toString('base64');
const fromBase64 = (s: string | null | undefined) => (s ? Buffer.from(s, 'base64').toString('utf8') : '');
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

function buildPayload(code: string, languageId: number, tc: TestCaseInput): Judge0SubmissionPayload {
    return {
        source_code: toBase64(code),
        language_id: languageId,
        stdin: toBase64(tc.input),
        expected_output: toBase64(tc.expectedOutput),
        cpu_time_limit: config.judge.maxExecutionTime / 1000,
        // Judge0 hard cap is 512 000 KB — mb*1000 gives the safe value
        memory_limit: Math.min(config.judge.maxMemoryLimit * 1000, 512_000),
    };
}

function decodeResult(raw: any): Judge0Result {
    return {
        ...raw,
        stdout: fromBase64(raw.stdout),
        stderr: fromBase64(raw.stderr),
        compile_output: fromBase64(raw.compile_output),
        message: fromBase64(raw.message),
    };
}

function buildClient(): AxiosInstance {
    const baseURL = process.env.JUDGE0_URL || config.judge.apiUrl;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    if (config.judge.apiKey) {
        headers['X-Auth-Token'] = config.judge.apiKey;
    }
    return axios.create({ baseURL, headers, timeout: 15_000 });
}

// ── Client class ──────────────────────────────────────────────────────────────
class Judge0ClientService {
    private client: AxiosInstance;

    constructor() {
        this.client = buildClient();
    }

    reload(): void {
        this.client = buildClient();
    }

    // ── Health ────────────────────────────────────────────────────────────────
    async isHealthy(): Promise<boolean> {
        try {
            const res = await this.client.get('/languages', { timeout: 5_000 });
            return Array.isArray(res.data) && res.data.length > 0;
        } catch {
            return false;
        }
    }

    // ── Language ──────────────────────────────────────────────────────────────
    getLanguageId(language: string): number {
        const id = JUDGE0_LANGUAGE_IDS[language];
        if (!id) throw new Error(`Unsupported language: ${language}`);
        return id;
    }

    // ── Single submission token ───────────────────────────────────────────────
    async submit(payload: { code: string; language: string; stdin: string; expectedOutput: string }): Promise<string> {
        const languageId = this.getLanguageId(payload.language);
        const body = buildPayload(payload.code, languageId, {
            input: payload.stdin,
            expectedOutput: payload.expectedOutput,
        });
        try {
            const res = await this.client.post<{ token: string }>(
                '/submissions',
                body,
                { params: { base64_encoded: true, wait: false } }
            );
            return res.data.token;
        } catch (err: any) {
            const detail = err?.response?.data ?? err?.message ?? 'unknown';
            throw new Error(`Judge0 submit failed: ${JSON.stringify(detail)}`);
        }
    }

    // ── Synchronous single submission (wait=true) ─────────────────────────────
    /** Submit and block until Judge0 returns the result (no polling needed). */
    async submitWait(payload: { code: string; language: string; stdin: string; expectedOutput: string }): Promise<Judge0Result> {
        const languageId = this.getLanguageId(payload.language);
        const body = buildPayload(payload.code, languageId, {
            input: payload.stdin,
            expectedOutput: payload.expectedOutput,
        });
        try {
            const res = await this.client.post(
                '/submissions',
                body,
                {
                    params: { base64_encoded: true, wait: true },
                    timeout: 30_000, // longer timeout for synchronous execution
                }
            );
            return decodeResult(res.data);
        } catch (err: any) {
            const detail = err?.response?.data ?? err?.message ?? 'unknown';
            throw new Error(`Judge0 submit (wait) failed: ${JSON.stringify(detail)}`);
        }
    }

    // ── Poll single token ─────────────────────────────────────────────────────
    async pollResult(token: string): Promise<Judge0Result> {
        for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
            await sleep(POLL_INTERVAL_MS);
            try {
                const res = await this.client.get(`/submissions/${token}`, {
                    params: {
                        base64_encoded: true,
                        fields: 'token,status,stdout,stderr,compile_output,message,time,memory,exit_code,exit_signal',
                    },
                });
                const result = decodeResult(res.data);
                if (result.status.id >= JUDGE0_STATUS.ACCEPTED) return result;
            } catch (err: any) {
                console.warn(`[Judge0] Poll attempt ${attempt + 1} for ${token}:`, err?.message);
            }
        }
        throw new Error(`Judge0 polling timed out after ${MAX_POLL_ATTEMPTS} attempts for token: ${token}`);
    }

    // ── Unified batch runner ──────────────────────────────────────────────────
    /**
     * Primary method for the worker: submit all test cases and return their results.
     *
     * Strategy (in order):
     *   1. Try Judge0 batch endpoint (/submissions/batch) — fastest for CE with batch plugin
     *   2. Fall back to sequential wait=true submissions — works on all CE instances,
     *      no polling needed since Judge0 holds the connection until done
     *
     * Always returns results in the same order as testCases.
     */
    async runBatch(
        code: string,
        language: string,
        testCases: TestCaseInput[]
    ): Promise<Judge0Result[]> {
        if (testCases.length === 0) return [];

        const languageId = this.getLanguageId(language);
        const submissions = testCases.map(tc => buildPayload(code, languageId, tc));

        // ── Attempt 1: batch endpoint ─────────────────────────────────────────
        try {
            const submitRes = await this.client.post<{ token: string }[]>(
                '/submissions/batch',
                { submissions },
                { params: { base64_encoded: true } }
            );
            const tokens = submitRes.data.map(s => s.token);
            console.log(`[Judge0] Batch submitted ${tokens.length} tokens, polling for results...`);

            // Poll all tokens concurrently
            const results: (Judge0Result | null)[] = new Array(tokens.length).fill(null);
            const pending = new Set(tokens.map((_, i) => i));

            for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS && pending.size > 0; attempt++) {
                await sleep(POLL_INTERVAL_MS);

                for (const idx of [...pending]) {
                    try {
                        const res = await this.client.get(`/submissions/${tokens[idx]}`, {
                            params: {
                                base64_encoded: true,
                                fields: 'token,status,stdout,stderr,compile_output,message,time,memory,exit_code,exit_signal',
                            },
                        });
                        const result = decodeResult(res.data);
                        if (result.status.id >= JUDGE0_STATUS.ACCEPTED) {
                            results[idx] = result;
                            pending.delete(idx);
                        }
                    } catch {
                        // Transient — try again next cycle
                    }
                }
            }

            if (pending.size > 0) {
                throw new Error(`Batch polling timed out: ${pending.size}/${tokens.length} unfinished`);
            }

            return results as Judge0Result[];

        } catch (batchErr: any) {
            // ── Fallback: sequential wait=true ────────────────────────────────
            console.warn(`[Judge0] Batch mode failed (${batchErr.message?.slice(0, 80)}), falling back to sequential wait=true`);

            const results: Judge0Result[] = [];
            for (let i = 0; i < testCases.length; i++) {
                console.log(`[Judge0] Sequential: submitting test case ${i + 1}/${testCases.length}`);
                const result = await this.submitWait({
                    code,
                    language,
                    stdin: testCases[i].input,
                    expectedOutput: testCases[i].expectedOutput,
                });
                results.push(result);
            }
            return results;
        }
    }

    // ── Legacy: getBatchResults (kept for compatibility) ───────────────────────
    async getBatchResults(tokens: string[]): Promise<Judge0Result[]> {
        return Promise.all(tokens.map(t => this.pollResult(t)));
    }
}

export const judge0Client = new Judge0ClientService();
