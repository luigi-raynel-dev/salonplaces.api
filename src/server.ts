import Fastify from 'fastify'
import fastifyEnv from '@fastify/env'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { planRoutes } from './routes/plan'
import { professionalRoutes } from './routes/professional'
import { setLanguage } from './plugins/setLanguage'

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

    fastify.addHook('onRequest', setLanguage)

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

    await fastify.register(planRoutes)
    await fastify.register(professionalRoutes, { prefix: '/professionals' })

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
