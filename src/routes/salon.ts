import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'
import { JWTPayload } from '../modules/auth'

export async function salonRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/join',
    {
      onRequest: [authenticate]
    },
    async (request, reply) => {
      const { email } = request.user as JWTPayload

      const user = await prisma.user.findUniqueOrThrow({
        where: { email }
      })

      const professional = await prisma.professional.findUniqueOrThrow({
        where: {
          userId: user.id
        }
      })

      const bodyScheme = z.object({
        name: z.string(),
        slug: z.string(),
        countryPlanId: z.number().nullable().optional(),
        location: z.object({
          address: z.string(),
          latitude: z.number(),
          longitude: z.number(),
          number: z.string(),
          zipCode: z.string(),
          complement: z.string().nullable().optional(),
          referencePoint: z.string().nullable().optional()
        })
      })
      const { name, slug, countryPlanId, location } = bodyScheme.parse(
        request.body
      )

      let salon = await prisma.salon.findUnique({ where: { slug } })

      if (salon)
        return reply.status(422).send({
          status: false,
          error: 'SLUG_IN_USE'
        })

      salon = await prisma.salon.create({
        data: {
          name,
          slug,
          countryPlanId,
          Location: {
            create: {
              active: true,
              ...location
            }
          }
        }
      })

      await prisma.salonHasProfessional.create({
        data: {
          active: true,
          isAdmin: true,
          professionalId: professional.id,
          salonId: salon.id
        }
      })

      return reply.status(201).send({
        status: true,
        salon
      })
    }
  )
}
