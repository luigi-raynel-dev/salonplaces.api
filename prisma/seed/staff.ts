import { Prisma, PrismaClient } from '@prisma/client'
import { genSaltSync, hashSync } from 'bcrypt'

export const createInitialStaffs = async (prisma: PrismaClient) => {
  const staffs: Prisma.StaffCreateArgs[] = [
    {
      data: {
        userName: 'user',
        email: 'user@salonplaces.com',
        password: hashSync('password', genSaltSync(10))
      }
    }
  ]

  for (const { data } of staffs) {
    const staff = await prisma.staff.findUnique({
      where: { userName: data.userName }
    })

    if (!staff) await prisma.staff.create({ data })
  }
}
