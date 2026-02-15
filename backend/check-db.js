// Quick script to check database status
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        const userCount = await prisma.user.count();
        const users = await prisma.user.findMany({
            select: { id: true, username: true, email: true, role: true }
        });
        const discussionCount = await prisma.discussion.count();

        console.log('=== DATABASE STATUS ===');
        console.log(`Total Users: ${userCount}`);
        console.log('\nUsers:');
        users.forEach(user => {
            console.log(`- ${user.username} (${user.email}) [${user.role}]`);
        });
        console.log(`\nTotal Discussions: ${discussionCount}`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();
