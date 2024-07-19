import { Prisma, PrismaClient } from '@prisma/client'

export const createInitialCountries = async (prisma: PrismaClient) => {
  const ptBr = await prisma.language.findUniqueOrThrow({
    where: { isoCode: 'pt-BR' }
  })
  const brl = await prisma.currency.findUniqueOrThrow({
    where: { code: 'BRL' }
  })

  const en = await prisma.language.findUniqueOrThrow({
    where: { isoCode: 'en' }
  })
  const eur = await prisma.currency.findUniqueOrThrow({
    where: { code: 'EUR' }
  })

  const countries: Prisma.CountryCreateArgs[] = [
    {
      data: {
        name: 'Brasil',
        universalName: 'Brazil',
        callingCode: '+55',
        isoCode: 'br',
        languageId: ptBr.id,
        currencyId: brl.id
      }
    },
    {
      data: {
        name: 'Ireland',
        universalName: 'Ireland',
        callingCode: '+353',
        isoCode: 'ie',
        languageId: en.id,
        currencyId: eur.id
      }
    }
  ]

  for (const { data } of countries) {
    const country = await prisma.country.findUnique({
      where: { isoCode: data.isoCode }
    })

    if (!country) await prisma.country.create({ data })
  }
}
