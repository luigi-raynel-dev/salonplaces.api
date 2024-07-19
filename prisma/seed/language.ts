import { Prisma, PrismaClient } from '@prisma/client'

export const createInitialLanguages = async (prisma: PrismaClient) => {
  const languages: Prisma.LanguageCreateArgs[] = [
    {
      data: {
        title: 'Português - BR',
        universalTitle: 'Portuguese - BR',
        isoCode: 'pt-br'
      }
    },
    {
      data: {
        title: 'English',
        universalTitle: 'English',
        isoCode: 'en'
      }
    }
  ]

  for (const { data } of languages) {
    const language = await prisma.language.findUnique({
      where: { isoCode: data.isoCode }
    })

    if (!language) await prisma.language.create({ data })
  }
}
