import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding fake ProgramStudents...");

    const testStudent = await prisma.programStudent.upsert({
        where: { email: 'student1@codingbuddy.edu' },
        update: {},
        create: {
            email: 'student1@codingbuddy.edu',
            name: 'Alice Johnson',
            programId: 'COLLEGE_2026'
        }
    });

    const testStudent2 = await prisma.programStudent.upsert({
        where: { email: 'froslider@gmail.com' },
        update: {},
        create: {
            email: 'froslider@gmail.com',
            name: 'Fro Slider',
            programId: 'COLLEGE_2026'
        }
    });

    console.log("Seeded test students:", testStudent, testStudent2);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
