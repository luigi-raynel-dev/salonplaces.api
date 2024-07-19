import { Prisma, PrismaClient } from '@prisma/client'

export const createInitialPaymentStatus = async (prisma: PrismaClient) => {
  const paymentStatusList: Prisma.PaymentStatusCreateArgs[] = [
    {
      data: {
        title: 'Pendind',
        name: 'pending',
        active: true
      }
    },
    {
      data: {
        title: 'Paid',
        name: 'paid',
        active: true
      }
    },
    {
      data: {
        title: 'Cancelled',
        name: 'cancelled',
        active: true
      }
    },
    {
      data: {
        title: 'Recused',
        name: 'recused',
        active: true
      }
    },
    {
      data: {
        title: 'Refunded',
        name: 'refunded',
        active: true
      }
    },
    {
      data: {
        title: 'Partially refunded',
        name: 'partiallyRefunded',
        active: true
      }
    }
  ]

  for (const { data } of paymentStatusList) {
    const paymentStatus = await prisma.paymentStatus.findUnique({
      where: { name: data.name }
    })

    if (!paymentStatus) await prisma.paymentStatus.create({ data })
  }
}
