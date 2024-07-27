import { Prisma, PrismaClient } from '@prisma/client'
import { genSaltSync, hashSync } from 'bcrypt'

export const createInitialUsers = async (prisma: PrismaClient) => {
  const users: Prisma.UserCreateArgs[] = [
    {
      data: {
        firstName: 'Jonh',
        lastName: 'Doe',
        email: 'user@salonplaces.com',
        password: hashSync('password', genSaltSync()),
        Staff: { create: {} }
      }
    }
  ]

  for (const { data } of users) {
    const user = await prisma.user.findUnique({
      where: { email: data.email! }
    })

    if (!user) await prisma.user.create({ data })
  }
}
