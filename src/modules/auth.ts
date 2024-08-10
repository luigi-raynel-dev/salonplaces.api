import { genSaltSync, hashSync } from 'bcrypt'
import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export interface JWTPayload {
  email: string
}

export const tokenGenerator = (
  { email }: JWTPayload,
  fastify: FastifyInstance
) => {
  return fastify.jwt.sign({ email }, { sub: email })
}

export const getHash = (password: string) => hashSync(password, genSaltSync())

export const generateUniqueUsername = async (
  baseUsername: string,
  suffix: number = 1
): Promise<string> => {
  const username = suffix <= 1 ? baseUsername : `${baseUsername}${suffix}`

  const user = await prisma.user.findUnique({ where: { username } })

  return !user ? username : generateUniqueUsername(baseUsername, suffix + 1)
}
