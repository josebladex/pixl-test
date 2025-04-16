// prisma/seed.ts
import { PrismaClient, Role } from '../src/app/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Datos de los usuarios
  const users = [
    {
      email: 'admin@example.com',
      role: 'ADMIN',
    },
    {
      email: 'user@example.com',
      role: 'USER',
    },
  ]

  const password = 'password123'
  const hashedPassword = await bcrypt.hash(password, 10)

  for (const { email, role } of users) {
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      console.log(`ℹ️ Usuario con email ${email} ya existe, se omite la creación.`)
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role as Role,
        },
      })
      console.log(`✅ Usuario ${role.toLowerCase()} creado:`, newUser)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
