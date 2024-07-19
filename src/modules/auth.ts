import { genSaltSync, hashSync } from 'bcrypt'
import { FastifyInstance } from 'fastify'

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
