import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'
import { salonAdmin } from '../plugins/salonAdmin'

export async function serviceRoutes(fastify: FastifyInstance) {
  fastify.get('/', async request => {
    const queryParams = z.object({
      slug: z.string()
    })
    const { slug } = queryParams.parse(request.params)

    const salon = await prisma.salon.findUniqueOrThrow({ where: { slug } })

    const services = await prisma.service.findMany({
      where: {
        salonId: salon.id
      }
    })

    return { services }
  })

  fastify.get('/:serviceId', async (request, reply) => {
    const queryParams = z.object({
      slug: z.string(),
      serviceId: z.string()
    })
    const { slug, serviceId } = queryParams.parse(request.params)

    const salon = await prisma.salon.findUniqueOrThrow({ where: { slug } })

    const id = Number(serviceId)

    let service = await prisma.service.findUnique({
      where: { id, salonId: salon.id }
    })

    if (!service)
      return reply.status(404).send({
        status: false,
        error: 'SERVICE_NOT_FOUND'
      })

    return { service }
  })

  fastify.post(
    '/',
    {
      onRequest: [authenticate, salonAdmin]
    },
    async (request, reply) => {
      const queryParams = z.object({
        slug: z.string()
      })
      const { slug } = queryParams.parse(request.params)

      const salon = await prisma.salon.findUniqueOrThrow({ where: { slug } })

      const bodyScheme = z.object({
        title: z.string(),
        description: z.string().nullable().optional(),
        price: z.number(),
        promocionalPrice: z.number().nullable().optional(),
        minutes: z.number(),
        active: z.boolean().default(true)
      })

      const data = bodyScheme.parse(request.body)

      const service = await prisma.service.create({
        data: {
          ...data,
          salonId: salon.id
        }
      })

      return reply.status(201).send({
        status: true,
        service
      })
    }
  )

  fastify.patch(
    '/:serviceId',
    {
      onRequest: [authenticate, salonAdmin]
    },
    async (request, reply) => {
      const queryParams = z.object({
        slug: z.string(),
        serviceId: z.string()
      })
      const { slug, serviceId } = queryParams.parse(request.params)

      const salon = await prisma.salon.findUniqueOrThrow({ where: { slug } })

      const id = Number(serviceId)

      let service = await prisma.service.findUnique({
        where: { id, salonId: salon.id }
      })

      if (!service)
        return reply.status(404).send({
          status: false,
          error: 'SERVICE_NOT_FOUND'
        })

      const bodyScheme = z.object({
        title: z.string(),
        description: z.string().nullable().optional(),
        price: z.number(),
        promocionalPrice: z.number().nullable().optional(),
        minutes: z.number(),
        active: z.boolean().default(true)
      })

      const data = bodyScheme.parse(request.body)

      service = await prisma.service.update({
        data: {
          ...data,
          salonId: salon.id,
          updatedAt: new Date()
        },
        where: { id }
      })

      return reply.send({
        status: true,
        service
      })
    }
  )

  fastify.delete(
    '/:serviceId',
    {
      onRequest: [authenticate, salonAdmin]
    },
    async (request, reply) => {
      const queryParams = z.object({
        slug: z.string(),
        serviceId: z.string()
      })
      const { slug, serviceId } = queryParams.parse(request.params)

      const salon = await prisma.salon.findUniqueOrThrow({ where: { slug } })

      const id = Number(serviceId)

      let service = await prisma.service.findUnique({
        where: { id, salonId: salon.id }
      })

      if (!service)
        return reply.status(404).send({
          status: false,
          error: 'SERVICE_NOT_FOUND'
        })

      await prisma.service.deleteMany({ where: { id } })

      return reply.send({
        status: true
      })
    }
  )
}
