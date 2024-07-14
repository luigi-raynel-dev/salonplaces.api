import { Prisma, PrismaClient } from '@prisma/client'

export const createInitialGateways = async (prisma: PrismaClient) => {
  const gateways: Prisma.GatewayCreateArgs[] = [
    {
      data: {
        title: 'Stripe',
        name: 'stripe',
        active: true
      }
    },
    {
      data: {
        title: 'Mercado Pago',
        name: 'mercadopago',
        active: true
      }
    },
    {
      data: {
        title: 'Open PIX',
        name: 'openpix',
        active: true
      }
    }
  ]

  for (const { data } of gateways) {
    const gateway = await prisma.gateway.findUnique({
      where: { name: data.name }
    })

    if (!gateway) await prisma.gateway.create({ data })
  }
}
