import { Prisma, PrismaClient } from '@prisma/client'

export const createInitialPlans = async (prisma: PrismaClient) => {
  const brazil = await prisma.country.findUniqueOrThrow({
    where: { isoCode: 'br' }
  })
  const ireland = await prisma.country.findUniqueOrThrow({
    where: { isoCode: 'ie' }
  })

  const plans: Prisma.PlanCreateArgs[] = [
    {
      data: {
        name: 'Starter',
        level: 1,
        recommended: false,
        exclusive: false,
        professionalsQuota: 1,
        maxProfessionals: 10,
        description:
          'A recommended plan for salons that are just starting out and have up to 10 professionals and just a single location.',
        multipleLocations: false,
        maxLocations: 1,
        daysTrial: 30,
        pixDiscount: 5,
        CountryPlan: {
          createMany: {
            data: [
              {
                countryId: brazil.id,
                customDescription:
                  'Um plano recomendado para salões que estão começando e que tenham até 10 profissionais e um único salão.',
                monthlyPrice: 49.9,
                monthlyPromotionalPrice: 39.9,
                quaterlyPrice: 119.9,
                quaterlyPromotionalPrice: 104.9,
                yearlyPrice: 399.9,
                yearlyPromotionalPrice: 379.9,
                monthlyPricePerUser: 9.9,
                quaterlyPricePerUser: 7.9,
                yearlyPricePerUser: 4.9,
                active: true
              },
              {
                countryId: ireland.id,
                monthlyPrice: 39.9,
                monthlyPromotionalPrice: 29.9,
                quaterlyPrice: 104.9,
                quaterlyPromotionalPrice: 79.9,
                yearlyPrice: 399.9,
                yearlyPromotionalPrice: 299.9,
                monthlyPricePerUser: 4.9,
                quaterlyPricePerUser: 3.9,
                yearlyPricePerUser: 1.9,
                active: true
              }
            ]
          }
        }
      }
    },
    {
      data: {
        name: 'Pro',
        level: 2,
        recommended: false,
        exclusive: false,
        professionalsQuota: 1,
        maxProfessionals: 50,
        description:
          'A recommended plan for experienced salons that have between 11 and 50 professionals or have between 2 and 5 locations.',
        multipleLocations: true,
        maxLocations: 10,
        daysTrial: 30,
        pixDiscount: 5,
        CountryPlan: {
          createMany: {
            data: [
              {
                countryId: brazil.id,
                customDescription:
                  'Um plano recomendado para salões experientes que tenham entre 11 e 50 profissionais ou tenham entre 2 e 5 unidades.',
                monthlyPrice: 99.9,
                monthlyPromotionalPrice: 69.9,
                quaterlyPrice: 249.9,
                quaterlyPromotionalPrice: 189.9,
                yearlyPrice: 899.9,
                yearlyPromotionalPrice: 749.9,
                monthlyPricePerUser: 6.9,
                quaterlyPricePerUser: 4.9,
                yearlyPricePerUser: 1.9,
                active: true
              },
              {
                countryId: ireland.id,
                monthlyPrice: 79.9,
                monthlyPromotionalPrice: 69.9,
                quaterlyPrice: 209.9,
                quaterlyPromotionalPrice: 199.9,
                yearlyPrice: 849.9,
                yearlyPromotionalPrice: 799.9,
                monthlyPricePerUser: 3.9,
                quaterlyPricePerUser: 1.9,
                yearlyPricePerUser: 0.9,
                active: true
              }
            ]
          }
        }
      }
    }
  ]

  for (const { data } of plans) {
    const plan = await prisma.plan.findUnique({ where: { name: data.name } })

    if (!plan) await prisma.plan.create({ data })
  }
}
