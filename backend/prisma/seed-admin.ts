
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env from one level up (backend root)
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  
  if (!email || !password) {
    console.error('ADMIN_EMAIL or ADMIN_PASSWORD not set in .env');
    console.log('Current env:', { email, password: password ? '********' : undefined });
    return;
  }

  console.log(`Hashing password for ${email}...`);
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('Creating/Updating admin user...');
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: Role.ADMIN,
      isVerified: true,
      isPremium: true
    },
    create: {
      email,
      username: 'admin',
      password: hashedPassword,
      fullName: 'Admin User',
      role: Role.ADMIN,
      isVerified: true,
      isPremium: true
    },
  });

  console.log(`Admin user created/updated successfully: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
