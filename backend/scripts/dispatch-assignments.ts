import { PrismaClient } from '@prisma/client';
import { EmailService } from '../src/services/email.service';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Checking for PENDING daily assignments...");

    const pendingAssignments = await prisma.dailyAssignment.findMany({
        where: { status: 'PENDING' },
        include: {
            student: true
        }
    });

    if (pendingAssignments.length === 0) {
        console.log("✅ No pending assignments found.");
        return;
    }

    console.log(`✉️  Found ${pendingAssignments.length} pending assignment(s). Dispatching emails...`);

    for (const assignment of pendingAssignments) {
        const { student, problemId } = assignment;

        // Fetch problem manually since we isolated the models
        const problem = await prisma.problem.findUnique({
            where: { id: problemId }
        });

        if (!problem) {
            console.error(`❌ Problem ID ${problemId} not found, skipping.`);
            continue;
        }

        const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const subject = `Your Daily Coding Challenge: ${problem.title}`;

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
              <h1>MyCodingBuddy College Program</h1>
            </div>
            <div class="content">
              <p>Hello ${student.name},</p>
              <p>Here is your daily coding assignment selected just for you.</p>
              
              <div class="problem-card">
                <div class="problem-title">${problem.title}</div>
                <div class="problem-meta">
                  <span class="badge badge-${problem.difficulty.toLowerCase()}">${problem.difficulty}</span>
                  <span> &bull; Assigned: ${date}</span>
                </div>
                <p>${problem.description.substring(0, 150)}...</p>
              </div>
    
              <div style="text-align: center;">
                <a href="http://localhost:5173/problems/${problem.slug}" class="btn">Solve Problem</a>
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

        try {
            console.log(`Sending to ${student.email}...`);
            const success = await EmailService.sendEmail(student.email, subject, html);

            if (success) {
                // Update assignment status
                await prisma.dailyAssignment.update({
                    where: { id: assignment.id },
                    data: { status: 'SENT' }
                });
                console.log(`✅ Successfully sent and marked SENT for ${student.email}`);
            } else {
                console.error(`❌ Failed to send to ${student.email}`);
            }
        } catch (error) {
            console.error(`❌ Error processing assignment ${assignment.id}:`, error);
        }
    }

    console.log("🎉 Dispatch complete!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
