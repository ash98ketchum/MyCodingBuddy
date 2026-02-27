// backend/src/worker/judge0.ts
//
// Legacy Judge0 client used by src/worker/index.ts (the decoupled async worker).
// The new primary client is src/services/judge0Client.service.ts.
// This file is kept for backward compatibility and now uses correct self-hosted headers.

import axios, { AxiosInstance } from 'axios';
import { config } from '@/config';

// Judge0 Language IDs — https://ce.judge0.com/languages/all
const LANGUAGE_IDS: Record<string, number> = {
    JAVASCRIPT: 63, // Node.js 12.14.0
    PYTHON: 71, // Python 3.8.1
    JAVA: 62, // OpenJDK 13.0.1
    CPP: 54, // C++ (GCC 9.2.0)
    C: 50, // C   (GCC 9.2.0)
};

interface SubmissionPayload {
    source_code: string;
    language_id: number;
    stdin?: string;
    expected_output?: string;
    cpu_time_limit?: number;
    memory_limit?: number;
}

interface SubmissionToken {
    token: string;
}

interface ExecutionStatus {
    id: number;
    description: string;
}

export interface ExecutionResponse {
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    message: string | null;
    exit_code: number | null;
    exit_signal: number | null;
    status: ExecutionStatus;
    time: string;
    memory: number;
    token: string;
}

class Judge0Client {
    private client: AxiosInstance;

    constructor() {
        // Use the environment-aware URL — this is the only place it should be read
        const baseURL = process.env.JUDGE0_URL || config.judge.apiUrl;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        // Only add auth token when running a secured self-hosted instance
        if (config.judge.apiKey) {
            headers['X-Auth-Token'] = config.judge.apiKey;
        }

        // ⚠️  DO NOT add X-RapidAPI-Key or X-RapidAPI-Host here —
        //     those are for the hosted cloud API, not self-hosted Judge0
        this.client = axios.create({ baseURL, headers, timeout: 15_000 });
    }

    getLanguageId(language: string): number {
        const id = LANGUAGE_IDS[language];
        if (!id) throw new Error(`Unsupported language: ${language}`);
        return id;
    }

    async submitBatch(sourceCode: string, language: string, testCases: any[]): Promise<string[]> {
        const languageId = this.getLanguageId(language);
        const toBase64 = (s: string | null | undefined) => Buffer.from(s || '').toString('base64');

        const submissions: SubmissionPayload[] = testCases.map(tc => ({
            source_code: toBase64(sourceCode),
            language_id: languageId,
            stdin: toBase64(tc.input),
            expected_output: toBase64(tc.expectedOutput),
            cpu_time_limit: config.judge.maxExecutionTime / 1000,
            memory_limit: config.judge.maxMemoryLimit * 1024,
        }));

        try {
            const res = await this.client.post<SubmissionToken[]>(
                '/submissions/batch',
                { submissions },
                { params: { base64_encoded: true } }
            );
            return res.data.map(s => s.token);
        } catch (err: any) {
            console.error('[Judge0 Legacy] Batch submission error:', err.response?.data ?? err.message);
            throw new Error('Failed to submit code to Judge0');
        }
    }

    async getBatchResults(tokens: string[]): Promise<ExecutionResponse[]> {
        if (tokens.length === 0) return [];
        const fromBase64 = (s: string | null | undefined) => (s ? Buffer.from(s, 'base64').toString('utf8') : '');

        try {
            const res = await this.client.get('/submissions/batch', {
                params: {
                    tokens: tokens.join(','),
                    base64_encoded: true,
                    fields: 'token,stdout,stderr,status,time,memory,compile_output,message',
                },
            });
            return res.data.submissions.map((s: any) => ({
                ...s,
                stdout: fromBase64(s.stdout),
                stderr: fromBase64(s.stderr),
                compile_output: fromBase64(s.compile_output),
                message: fromBase64(s.message),
            }));
        } catch (err: any) {
            console.error('[Judge0 Legacy] Batch retrieval error:', err.response?.data ?? err.message);
            throw new Error('Failed to retrieve results from Judge0');
        }
    }
}

export const judge0 = new Judge0Client();
