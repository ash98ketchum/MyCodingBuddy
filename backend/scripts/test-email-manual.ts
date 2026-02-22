
import { EmailService } from '../src/services/email.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'froslider@gmail.com';
    const problemSlug = 'two-sum';

    console.log(`🔍 Finding problem: ${problemSlug}...`);
    const problem = await prisma.problem.findUnique({
        where: { slug: problemSlug },
    });

    if (!problem) {
        console.error(`❌ Problem '${problemSlug}' not found!`);
        return;
    }

    console.log(`✅ Found problem: ${problem.title}`);

    const subject = `Test Email: Problem Assignment - ${problem.title}`;
    const html = `
    <h1>Problem Assignment</h1>
    <p>Hi there,</p>
    <p>Here is your problem assignment:</p>
    <h2>${problem.title}</h2>
    <p><strong>Difficulty:</strong> ${problem.difficulty}</p>
    <p>${problem.description}</p>
    <p><a href="http://localhost:3000/problem/${problem.slug}">Solve Now</a></p>
  `;

    console.log(`📧 Sending email to ${email}...`);
    await EmailService.sendEmail(email, subject, html);
    console.log('✅ Email send function executed successfully.');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
