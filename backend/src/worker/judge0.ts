import axios, { AxiosInstance } from 'axios';
import { config } from '@/config';

// Judge0 Language IDs
// https://ce.judge0.com/languages/all
const LANGUAGE_IDS: Record<string, number> = {
    JAVASCRIPT: 63, // JavaScript (Node.js 12.14.0)
    PYTHON: 71,     // Python (3.8.1)
    JAVA: 62,       // Java (OpenJDK 13.0.1)
    CPP: 54,        // C++ (GCC 9.2.0)
    C: 50,          // C (GCC 9.2.0)
};

interface Submission {
    source_code: string;
    language_id: number;
    stdin?: string;
    expected_output?: string;
    cpu_time_limit?: number; // seconds
    memory_limit?: number;   // KB
}

interface SubmissionResult {
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
    exit_code: number;
    exit_signal: number;
    status: ExecutionStatus;
    time: string;
    memory: number;
    token: string;
}

class Judge0Client {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: config.judge.apiUrl,
            headers: {
                'Content-Type': 'application/json',
                ...(config.judge.apiKey ? { 'X-RapidAPI-Key': config.judge.apiKey } : {}),
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            },
        });
    }

    getLanguageId(language: string): number {
        const id = LANGUAGE_IDS[language];
        if (!id) {
            throw new Error(`Unsupported language: ${language}`);
        }
        return id;
    }

    async submitBatch(sourceCode: string, language: string, testCases: any[]): Promise<string[]> {
        const languageId = this.getLanguageId(language);

        const submissions: Submission[] = testCases.map((tc) => ({
            source_code: sourceCode,
            language_id: languageId,
            stdin: tc.input,
            expected_output: tc.expectedOutput,
            cpu_time_limit: config.judge.maxExecutionTime / 1000, // Convert ms to seconds
            // Judge0 memory limit is in KB
            memory_limit: config.judge.maxMemoryLimit * 1024,
        }));

        try {
            const response = await this.client.post('/submissions/batch', {
                submissions,
            }, {
                params: {
                    base64_encoded: false,
                }
            });

            return response.data.map((s: SubmissionResult) => s.token);
        } catch (error: any) {
            console.error('Judge0 Batch Submission Error:', error.response?.data || error.message);
            throw new Error('Failed to submit code to Judge0');
        }
    }

    async getBatchResults(tokens: string[]): Promise<ExecutionResponse[]> {
        if (tokens.length === 0) return [];

        try {
            const response = await this.client.get('/submissions/batch', {
                params: {
                    tokens: tokens.join(','),
                    base64_encoded: false,
                    fields: 'token,stdout,stderr,status,time,memory,compile_output,message',
                },
            });

            return response.data.submissions;
        } catch (error: any) {
            console.error('Judge0 Batch Retrieval Error:', error.response?.data || error.message);
            throw new Error('Failed to retrieve results from Judge0');
        }
    }
}

export const judge0 = new Judge0Client();
