import Fastify from 'fastify'
import fastifyEnv from '@fastify/env'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

const schema = {
  type: 'object',
  required: ['DATABASE_URL', 'JWT_KEY'],
  properties: {
    JWT_KEY: {
      type: 'string'
    },
    DATABASE_URL: {
      type: 'string'
    },
    FASTIFY_PORT: {
      type: 'string'
    }
  }
}

const options = {
  confKey: 'config',
  schema,
  dotenv: true,
  data: process.env
}

async function bootstrap() {
  const fastify = Fastify({
    logger: true
  })

  try {
    await fastify.register(fastifyEnv, options)

    await fastify.register(cors, {
      origin: true
    })

    await fastify.register(jwt, {
      secret: process.env.JWT_KEY || ''
    })

    fastify.get('/ping', async (_, reply) => {
      return reply.status(200).send({
        status: true,
        statusMessage: 'HTTP Server running!',
        message: 'pong'
      })
    })

    const port = Number(process.env.FASTIFY_PORT) || 3333

    await fastify.listen({
      port,
      host: '0.0.0.0'
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

bootstrap()
