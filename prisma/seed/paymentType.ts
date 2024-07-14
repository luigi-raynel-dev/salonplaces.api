import { Prisma, PrismaClient } from '@prisma/client'

export const createInitialPaymentTypes = async (prisma: PrismaClient) => {
  const paymentTypes: Prisma.PaymentTypeCreateArgs[] = [
    {
      data: {
        title: 'Credit Card',
        name: 'credit',
        active: true
      }
    },
    {
      data: {
        title: 'Debit Card',
        name: 'debit',
        active: true
      }
    },
    {
      data: {
        title: 'PIX',
        name: 'pix',
        active: true
      }
    }
  ]

  for (const { data } of paymentTypes) {
    const paymentType = await prisma.paymentType.findUnique({
      where: { name: data.name }
    })

    if (!paymentType) await prisma.paymentType.create({ data })
  }
}
