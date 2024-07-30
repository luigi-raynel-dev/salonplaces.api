import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'
import { JWTPayload } from '../modules/auth'

export async function professionalRoutes(fastify: FastifyInstance) {
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
        name: z.string().min(2),
        slug: z.string(),
        planCountryId: z.number()
      })
      const data = bodyScheme.parse(request.body)

      const salon = await prisma.salon.create({
        data: {
          ...data
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
