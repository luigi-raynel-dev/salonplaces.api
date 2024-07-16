import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { Prisma } from '@prisma/client'
import { getHash, tokenGenerator } from '../modules/auth'
import { compareSync } from 'bcrypt'

export async function professionalRoutes(fastify: FastifyInstance) {
  fastify.post('/signUp', async (request, reply) => {
    const bodyScheme = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6)
    })
    const { name, email, password } = bodyScheme.parse(request.body)

    let professional = await prisma.professional.findUnique({
      where: { email }
    })

    if (professional && professional.password)
      return reply.status(401).send({
        status: false,
        message: 'User is already registered.',
        error: 'USER_ALREADY_EXISTS'
      })

    const hash = getHash(password)
    const data: Prisma.ProfessionalCreateInput = {
      name,
      email,
      online: false,
      password: hash
    }
    professional = professional
      ? await prisma.professional.update({
          data,
          where: {
            email
          }
        })
      : await prisma.professional.create({ data })

    return reply.status(201).send({
      status: true,
      message: 'Professional was successfully registered!',
      professional_token: tokenGenerator({ email }, fastify),
      professional: {
        ...professional,
        password: undefined
      }
    })
  })

  fastify.post('/signIn', async (request, reply) => {
    const bodyScheme = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })
    const { email, password } = bodyScheme.parse(request.body)

    let professional = await prisma.professional.findUnique({
      where: { email }
    })

    if (!professional || !professional.password)
      return reply.status(401).send({
        status: false,
        message: 'Incomplete registration.',
        error:
          professional && !professional.password
            ? 'INCOMPLETE_REGISTRATION'
            : 'USER_NOT_FOUND'
      })

    if (!compareSync(password, professional.password || ''))
      return reply.status(401).send({
        status: false,
        message: 'Invalid password.',
        error: 'INVALID_PASSWORD'
      })

    return {
      status: true,
      message: 'Professional was successfully authenticated!',
      professional_token: tokenGenerator({ email }, fastify),
      professional: {
        ...professional,
        password: undefined
      }
    }
  })
}
