import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { Prisma, User } from '@prisma/client'
import { getHash, JWTPayload, tokenGenerator } from '../modules/auth'
import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import { authenticate } from '../plugins/authenticate'
import { translate } from '../modules/translate'
import { sendCode, validateCode } from '../modules/userCode'
import fs from 'fs'
import path from 'path'

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

const avatarBasePath = path.join(
  __dirname,
  '..',
  'public',
  'uploads',
  'avatars'
)

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

  fastify.post('/password-recovery', async request => {
    const bodyScheme = z.object({
      email: z.string().email()
    })
    const { email } = bodyScheme.parse(request.body)

    let user = await prisma.user.findUnique({
      where: { email }
    })
    if (!user || !user.password)
      return {
        status: false,
        message: translate('USER_NOT_FOUND'),
        error: 'USER_NOT_FOUND'
      }

    const action = translate('PASSWORD_RECOVERY')
    const emailResponse = await sendCode(
      user,
      translate('CODE_REQUEST', { action }),
      action,
      'password-recovery'
    )

    return emailResponse
  })

  fastify.post('/validate-code', async request => {
    const bodyScheme = z.object({
      code: z.string(),
      email: z.string().email()
    })

    const { code, email } = bodyScheme.parse(request.body)

    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password)
      return {
        status: false,
        message: translate('USER_NOT_FOUND'),
        error: 'USER_NOT_FOUND'
      }

    const userCode = await validateCode(user.id, code)

    return {
      status: userCode !== null,
      token: userCode ? tokenGenerator({ email }, fastify) : undefined,
      user: !userCode
        ? undefined
        : {
            ...user,
            password: undefined
          }
    }
  })

  fastify.patch(
    '/password',
    {
      onRequest: [authenticate]
    },
    async request => {
      const bodyScheme = z.object({
        password: z.string().min(6)
      })
      const { password } = bodyScheme.parse(request.body)
      const { email } = request.user as JWTPayload
      const hash = hashSync(password, genSaltSync())

      await prisma.user.update({
        data: { password: hash },
        where: { email }
      })

      return { status: true }
    }
  )

  fastify.patch(
    '/avatar',
    {
      onRequest: [authenticate]
    },
    async (request, reply) => {
      const bodyScheme = z.object({
        base64: z.string().base64().nullable()
      })
      const { base64 } = bodyScheme.parse(request.body)
      const { email } = request.user as JWTPayload

      const user = await prisma.user.findUniqueOrThrow({
        where: { email }
      })

      if (user.avatarUrl) {
        fs.unlink(path.join(avatarBasePath, user.avatarUrl), error => {
          if (error) console.error(error)
        })
      }

      let avatarUrl = null

      if (base64) {
        const buffer = Buffer.from(base64, 'base64')

        const timestamp = Date.now()
        avatarUrl = `${timestamp}_${user.id}.jpg`

        const filePath = path.join(avatarBasePath, avatarUrl)

        fs.writeFile(filePath, buffer, error => {
          if (error)
            return reply
              .status(500)
              .send({ status: false, errorDetails: error.message })
        })
      }

      await prisma.user.update({
        data: { avatarUrl },
        where: { email }
      })

      return { status: true }
    }
  )

  fastify.get('/avatar/:avatarUrl', async (request, reply) => {
    const queryParams = z.object({
      avatarUrl: z.string()
    })
    const { avatarUrl } = queryParams.parse(request.params)

    const filePath = path.join(avatarBasePath, avatarUrl)
    try {
      const buffer = fs.readFileSync(filePath)
      reply.type('image/jpeg').send(buffer)
    } catch {
      return reply.status(404).send()
    }
  })
}
