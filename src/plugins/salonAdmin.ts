import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { JWTPayload } from '../modules/auth'

export async function salonAdmin(request: FastifyRequest, reply: FastifyReply) {
  const queryParams = z.object({
    slug: z.string()
  })
  const { slug } = queryParams.parse(request.params)

  const salon = await prisma.salon.findUnique({ where: { slug } })

  if (!salon)
    return reply.status(404).send({
      status: false,
      error: 'SALON_NOT_FOUND'
    })

  const { email } = request.user as JWTPayload

  const user = await prisma.user.findUniqueOrThrow({
    where: { email }
  })

  const professional = await prisma.professional.findUniqueOrThrow({
    where: {
      userId: user.id
    }
  })

  const adminProfessional = await prisma.salonHasProfessional.findUnique({
    where: {
      salonId_professionalId: {
        professionalId: professional.id,
        salonId: salon.id
      },
      isAdmin: true
    }
  })

  if (!adminProfessional)
    return reply.status(403).send({
      status: false,
      error: 'SALON_ADMIN_ROLE'
    })
}
