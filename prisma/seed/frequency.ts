import { PrismaClient } from '@prisma/client'

export const createInitialFrequencies = async (prisma: PrismaClient) => {
  const frequencyTypes = ['Monthly', 'Quaterly', 'Yearly']

  for (const type of frequencyTypes) {
    const frequency = await prisma.frequency.findUnique({ where: { type } })

    if (!frequency) await prisma.frequency.create({ data: { type } })
  }
}
