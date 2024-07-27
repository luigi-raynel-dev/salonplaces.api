import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { Prisma, User } from '@prisma/client'
import { getHash, JWTPayload, tokenGenerator } from '../modules/auth'
import { compareSync } from 'bcrypt'
import { authenticate } from '../plugins/authenticate'
import { translate } from '../modules/translate'

const authReply = (user: User, fastify: FastifyInstance) => {
  return {
    status: true,
    accessToken: tokenGenerator({ email: user.email! }, fastify),
    user: {
      ...user,
      password: undefined
    }
  }
}

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/signUp', async (request, reply) => {
    const bodyScheme = z.object({
      firstName: z.string().min(3),
      lastName: z.string().min(3).optional().nullable(),
      email: z.string().email(),
      password: z.string().min(6)
    })
    const { firstName, lastName, email, password } = bodyScheme.parse(
      request.body
    )

    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (user && user.password)
      return reply.status(401).send({
        status: false,
        message: translate('USER_ALREADY_EXISTS'),
        error: 'USER_ALREADY_EXISTS'
      })

    const hash = getHash(password)
    const data: Prisma.UserCreateInput = {
      firstName,
      lastName,
      email,
      password: hash
    }
    user = user
      ? await prisma.user.update({
          data,
          where: {
            email
          }
        })
      : await prisma.user.create({ data })

    return reply.status(201).send(authReply(user, fastify))
  })

  fastify.post('/signIn', async (request, reply) => {
    const bodyScheme = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })
    const { email, password } = bodyScheme.parse(request.body)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password)
      return reply.status(401).send({
        status: false,
        message: translate('INVALID_USER_OR_PASSWORD'),
        error: 'userNotFound'
      })

    if (!compareSync(password, user.password || ''))
      return reply.status(401).send({
        status: false,
        message: translate('INVALID_USER_OR_PASSWORD'),
        error: 'INVALID_USER_OR_PASSWORD'
      })

    return authReply(user, fastify)
  })

  fastify.get(
    '/me',
    {
      onRequest: [authenticate]
    },
    async request => {
      const { email } = request.user as JWTPayload

      const user = await prisma.user.findUniqueOrThrow({
        where: { email }
      })

      return {
        user: {
          ...user,
          password: undefined
        }
      }
    }
  )

  fastify.patch(
    '/me',
    {
      onRequest: [authenticate]
    },
    async request => {
      const { email } = request.user as JWTPayload

      let user = await prisma.user.findUniqueOrThrow({
        where: { email }
      })

      const bodyScheme = z.object({
        name: z.string(),
        firstName: z.string().min(3),
        lastName: z.string().min(3).nullable().optional(),
        birthday: z.date().nullable().optional(),
        phone: z.string().nullable().optional()
      })
      const data = bodyScheme.parse(request.body)

      user = await prisma.user.update({
        data,
        where: { email }
      })

      return {
        status: true,
        user: {
          ...user,
          password: undefined
        }
      }
    }
  )
}
