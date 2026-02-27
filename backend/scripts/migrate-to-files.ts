
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const PROBLEMS_DIR = path.join(__dirname, '..', 'problems');
const CASE_SEP = '\n[[[CASE_SEPARATOR]]]\n';

async function migrate() {
    console.log('🚀 Starting Problem Migration (DB -> Filesystem)...');

    if (!fs.existsSync(PROBLEMS_DIR)) {
        fs.mkdirSync(PROBLEMS_DIR, { recursive: true });
    }

    const problems = await prisma.problem.findMany({
        include: { testCases: true }
    });

    console.log(`Found ${problems.length} problems to migrate.`);

    for (const problem of problems) {
        const slug = problem.slug;
        const problemPath = path.join(PROBLEMS_DIR, slug);

        console.log(`  Processing: ${slug}...`);

        if (!fs.existsSync(problemPath)) {
            fs.mkdirSync(problemPath, { recursive: true });
        }

        // 1. problem-name.txt
        fs.writeFileSync(path.join(problemPath, 'problem-name.txt'), problem.title.trim());

        // 2. problem-statement.txt
        fs.writeFileSync(path.join(problemPath, 'problem-statement.txt'), problem.description.trim());

        // 3. constraints.txt
        fs.writeFileSync(path.join(problemPath, 'constraints.txt'), (problem.constraints || '').trim());

        const sampleCases = problem.testCases.filter(tc => tc.isSample);
        const hiddenCases = problem.testCases.filter(tc => !tc.isSample);

        // 4. sample-input.txt
        const sampleInput = sampleCases.map(tc => tc.input.trim()).join(CASE_SEP);
        fs.writeFileSync(path.join(problemPath, 'sample-input.txt'), sampleInput);

        // 5. sample-output.txt
        const sampleOutput = sampleCases.map(tc => tc.expectedOutput.trim()).join(CASE_SEP);
        fs.writeFileSync(path.join(problemPath, 'sample-output.txt'), sampleOutput);

        // 6. input.txt (Hidden)
        const hiddenInput = hiddenCases.map(tc => tc.input.trim()).join(CASE_SEP);
        fs.writeFileSync(path.join(problemPath, 'input.txt'), hiddenInput);

        // 7. output.txt (Hidden)
        const hiddenOutput = hiddenCases.map(tc => tc.expectedOutput.trim()).join(CASE_SEP);
        fs.writeFileSync(path.join(problemPath, 'output.txt'), hiddenOutput);

        console.log(`    ✅ Migrated ${slug}`);
    }

    console.log('✨ Migration complete!');
}

migrate()
    .catch(e => {
        console.error('❌ Migration failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
