import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function planRoutes(fastify: FastifyInstance) {
  fastify.get('/plans', async request => {
    const queryScheme = z.object({
      countryIsoCode: z.string().nullable().optional()
    })

    const { countryIsoCode } = queryScheme.parse(request.query)

    const plans = await prisma.plan.findMany({
      include: {
        CountryPlan: {
          include: {
            country: {
              include: {
                language: true,
                currency: true
              }
            }
          },
          where: {
            active: true,
            country: !countryIsoCode
              ? undefined
              : {
                  isoCode: {
                    equals: countryIsoCode
                  }
                }
          }
        }
      },
      where: {
        exclusive: false
      },
      orderBy: [
        {
          level: 'asc'
        },
        {
          id: 'asc'
        }
      ]
    })

    return { plans }
  })
}
