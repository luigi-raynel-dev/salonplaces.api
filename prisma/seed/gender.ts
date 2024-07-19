import { Prisma, PrismaClient } from '@prisma/client'

export const createInitialGenders = async (prisma: PrismaClient) => {
  const genders: Prisma.GenderCreateArgs[] = [
    {
      data: {
        name: 'Male'
      }
    },
    {
      data: {
        name: 'Female'
      }
    },
    {
      data: {
        name: 'Non-binary'
      }
    },
    {
      data: {
        name: 'Other'
      }
    }
  ]

  for (const { data } of genders) {
    const gender = await prisma.gender.findUnique({
      where: { name: data.name }
    })

    if (!gender) await prisma.gender.create({ data })
  }
}
