import { PrismaClient } from "@prisma/client";

export const run = async (prisma: PrismaClient) => {
  const frequencyTypes = ["Monthly", "Quaterly", "Yearly"]

  frequencyTypes.forEach(async type => {
    const frequency = await prisma.frequency.findUnique({ where: { type }})

    if(!frequency) await prisma.frequency.create({data: { type }})
  })

}