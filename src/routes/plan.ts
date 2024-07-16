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

  fastify.get('/plans/:id', async (request, reply) => {
    const queryParams = z.object({
      id: z.string()
    })
    const { id } = queryParams.parse(request.params)

    const queryScheme = z.object({
      countryIsoCode: z.string().nullable().optional()
    })

    const { countryIsoCode } = queryScheme.parse(request.query)

    const plan = await prisma.plan.findUnique({
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
      where: { id: parseInt(id) }
    })

    return plan ? { plan } : reply.status(404).send()
  })
}
