import { Prisma, PrismaClient } from '@prisma/client'

export const createInitialCurrencies = async (prisma: PrismaClient) => {
  const currencies: Prisma.CurrencyCreateArgs[] = [
    {
      data: {
        title: 'Real',
        code: 'BRL',
        symbol: 'R$'
      }
    },
    {
      data: {
        title: 'Dollar',
        code: 'USD',
        symbol: '$'
      }
    },
    {
      data: {
        title: 'Euro',
        code: 'EUR',
        symbol: '€'
      }
    },
    {
      data: {
        title: 'Pound',
        code: 'GBP',
        symbol: '£'
      }
    }
  ]

  for (const { data } of currencies) {
    const currency = await prisma.currency.findUnique({
      where: { code: data.code }
    })

    if (!currency) await prisma.currency.create({ data })
  }
}
