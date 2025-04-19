import { PrismaClient, Role } from '../src/app/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'admin1@example.com',
      role: 'ADMIN',
    },
    {
      email: 'admin2@example.com',
      role: 'ADMIN',
    },
    {
      email: 'user1@example.com',
      role: 'USER',
    },
    {
      email: 'user2@example.com',
      role: 'USER',
    },
  ];

  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  for (const { email, role } of users) {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      console.log(`ℹ️ User with email ${email} already exists, skipping creation.`);
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role as Role,
        },
      });
      console.log(`✅ ${role.toLowerCase()} user created:`, newUser);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
