
import fs from 'fs';
import path from 'path';

export interface FileTestCase {
    input: string;
    expectedOutput: string;
}

export interface ProblemMeta {
    slug: string;
    title: string;
    description: string;
    constraints: string;
}

const PROBLEMS_DIR = path.join(process.cwd(), 'problems');
const CASE_SEP = '[[[CASE_SEPARATOR]]]';

class ProblemLoaderService {
    private cache: Map<string, {
        meta: ProblemMeta;
        samples: FileTestCase[];
        hidden: FileTestCase[];
    }> = new Map();

    /**
     * Initialize the loader by reading all folders in the problems directory.
     * Validates integrity and caches data in memory.
     */
    public initialize(): void {
        console.log('🔍 [ProblemLoader] Initializing problem cache...');

        if (!fs.existsSync(PROBLEMS_DIR)) {
            console.warn(`⚠️  [ProblemLoader] Problems directory not found: ${PROBLEMS_DIR}`);
            console.warn(`   → Submissions will fail until problems/ is available.`);
            return; // graceful degradation — don't crash the server
        }

        const folders = fs.readdirSync(PROBLEMS_DIR).filter(f =>
            fs.statSync(path.join(PROBLEMS_DIR, f)).isDirectory()
        );

        console.log(`📂 [ProblemLoader] Found ${folders.length} potential problems.`);

        for (const slug of folders) {
            try {
                this.loadProblem(slug);
            } catch (err: any) {
                console.error(`⚠️  [ProblemLoader] Skipping ${slug}: ${err.message}`);
            }
        }

        console.log('✅ [ProblemLoader] Cache initialization complete.');
    }

    private loadProblem(slug: string): void {
        const problemDir = path.join(PROBLEMS_DIR, slug);
        const requiredFiles = [
            'problem-name.txt',
            'problem-statement.txt',
            'constraints.txt',
            'sample-input.txt',
            'sample-output.txt',
            'input.txt',
            'output.txt'
        ];

        // 1. Validate required files exist
        for (const file of requiredFiles) {
            if (!fs.existsSync(path.join(problemDir, file))) {
                throw new Error(`[ProblemLoader] Missing required file: ${file} in problem: ${slug}`);
            }
        }

        // 2. Read and parse
        try {
            const title = fs.readFileSync(path.join(problemDir, 'problem-name.txt'), 'utf8').trim();
            const statement = fs.readFileSync(path.join(problemDir, 'problem-statement.txt'), 'utf8').trim();
            const constraints = fs.readFileSync(path.join(problemDir, 'constraints.txt'), 'utf8').trim();

            if (!title) throw new Error(`[ProblemLoader] Title is empty for problem: ${slug}`);

            const samples = this.parseTestCases(
                fs.readFileSync(path.join(problemDir, 'sample-input.txt'), 'utf8'),
                fs.readFileSync(path.join(problemDir, 'sample-output.txt'), 'utf8'),
                slug,
                'sample'
            );

            const hidden = this.parseTestCases(
                fs.readFileSync(path.join(problemDir, 'input.txt'), 'utf8'),
                fs.readFileSync(path.join(problemDir, 'output.txt'), 'utf8'),
                slug,
                'hidden'
            );

            this.cache.set(slug, {
                meta: { slug, title, description: statement, constraints },
                samples,
                hidden
            });

            console.log(`   [ProblemLoader] Cached: ${slug} (${samples.length} samples, ${hidden.length} hidden)`);
        } catch (error: any) {
            throw error; // re-throw — caller's try/catch handles skip
        }
    }

    private parseTestCases(inputBlob: string, outputBlob: string, slug: string, type: string): FileTestCase[] {
        const marker = '[[[CASE_SEPARATOR]]]';

        // Split by marker and trim each part. 
        // Important: split on a trimmed blob to avoid artifacts from leading/trailing whitespace,
        // but preserve internal empty parts.
        const inputs = inputBlob.trim().split(marker).map(s => s.trim());
        const outputs = outputBlob.trim().split(marker).map(s => s.trim());

        if (slug === 'longest-substring-without-repeating-characters') {
            console.log(`[ProblemLoader] DEBUG for ${slug}: inputs=${inputs.length}, outputs=${outputs.length}`);
        }

        if (inputs.length !== outputs.length) {
            console.error(`[ProblemLoader] ERROR: Count mismatch for ${slug} (${type})`);
            console.error(`   Inputs found: ${inputs.length}, Outputs found: ${outputs.length}`);
            throw new Error(`Test case count mismatch for ${slug} (${type}): ${inputs.length} inputs vs ${outputs.length} outputs.`);
        }

        return inputs.map((input, i) => ({
            input,
            expectedOutput: outputs[i]
        }));
    }

    public getProblemMeta(slug: string): ProblemMeta | undefined {
        return this.cache.get(slug)?.meta;
    }

    public getSampleTestCases(slug: string): FileTestCase[] {
        return this.cache.get(slug)?.samples || [];
    }

    public getHiddenTestCases(slug: string): FileTestCase[] {
        return this.cache.get(slug)?.hidden || [];
    }

    public getAllSlugs(): string[] {
        return Array.from(this.cache.keys());
    }
}

export const problemLoader = new ProblemLoaderService();
