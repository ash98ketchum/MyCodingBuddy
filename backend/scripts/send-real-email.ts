
import { EmailService } from '../src/services/email.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'froslider@gmail.com';
    const problemSlug = 'two-sum';

    const problem = await prisma.problem.findUnique({
        where: { slug: problemSlug },
    });

    if (!problem) {
        console.error(`❌ Problem '${problemSlug}' not found!`);
        return;
    }

    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const subject = `Your Daily Coding Challenge: ${problem.title}`;

    // Professional HTML Template
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px; color: #333333; line-height: 1.6; }
        .problem-card { background-color: #f8f9fa; border-left: 5px solid #764ba2; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .problem-title { font-size: 20px; font-weight: bold; color: #2d3748; margin-bottom: 10px; }
        .problem-meta { font-size: 14px; color: #718096; margin-bottom: 15px; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; color: white; }
        .badge-easy { background-color: #48bb78; }
        .badge-medium { background-color: #ecc94b; color: #744210; }
        .badge-hard { background-color: #f56565; }
        .btn { display: inline-block; background-color: #764ba2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; text-align: center; margin-top: 20px; transition: background-color 0.3s; }
        .btn:hover { background-color: #5a3780; }
        .footer { background-color: #edf2f7; padding: 20px; text-align: center; font-size: 12px; color: #718096; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>MyCodingBuddy</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Here is your daily coding assignment selected just for you.</p>
          
          <div class="problem-card">
            <div class="problem-title">${problem.title}</div>
            <div class="problem-meta">
              <span class="badge badge-${problem.difficulty.toLowerCase()}">${problem.difficulty}</span>
              <span> &bull; Assigned: ${date} at ${time}</span>
            </div>
            <p>${problem.description.substring(0, 150)}...</p>
          </div>

          <div style="text-align: center;">
            <a href="http://localhost:3000/problem/${problem.slug}" class="btn">Solve Problem</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} MyCodingBuddy. All rights reserved.<br>
          Keep coding, keep growing!
        </div>
      </div>
    </body>
    </html>
  `;

    console.log(`📧 Sending professional email to ${email}...`);
    const success = await EmailService.sendEmail(email, subject, html);

    if (success) {
        console.log('✅ Email sent successfully!');
    } else {
        console.error('❌ Failed to send email. Check your SMTP configuration.');
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
