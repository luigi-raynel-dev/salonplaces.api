import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'
import { salonAdmin } from '../plugins/salonAdmin'

export async function locationRoutes(fastify: FastifyInstance) {
  fastify.patch(
    '/:locationId',
    {
      onRequest: [authenticate, salonAdmin]
    },
    async (request, reply) => {
      const queryParams = z.object({
        locationId: z.string(),
        slug: z.string()
      })
      const { locationId, slug } = queryParams.parse(request.params)

      const id = Number(locationId)

      let location = await prisma.location.findUnique({
        where: {
          id,
          salon: {
            slug: {
              equals: slug
            }
          }
        }
      })

      if (!location)
        return reply.status(404).send({
          status: false,
          error: 'LOCATION_NOT_FOUND'
        })

      const bodyScheme = z.object({
        name: z.string().nullable().optional(),
        active: z.boolean().default(location.active),
        phone: z.string().optional().nullable(),
        zipCode: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        address: z.string().optional(),
        number: z.string().optional(),
        complement: z.string().optional().nullable(),
        referencePoint: z.string().optional().nullable(),
        wifi: z.boolean().optional().nullable(),
        kid: z.boolean().optional().nullable(),
        accessibility: z.boolean().optional().nullable(),
        parking: z.boolean().optional().nullable(),
        tv: z.boolean().optional().nullable(),
        debitCard: z.boolean().optional().nullable(),
        creditCard: z.boolean().optional().nullable(),
        cash: z.boolean().optional().nullable(),
        pix: z.boolean().optional().nullable(),
        otherPaymentTypes: z.string().optional().nullable()
      })

      const data = bodyScheme.parse(request.body)

      location = await prisma.location.update({
        data: {
          ...data,
          updatedAt: new Date()
        },
        where: { id }
      })

      return reply.send({
        status: true,
        location
      })
    }
  )
}
