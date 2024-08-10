import { FastifyInstance } from 'fastify'
import { object, z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'
import { salonAdmin } from '../plugins/salonAdmin'
import { Prisma } from '@prisma/client'
import { handleOpeningHours } from '../modules/openingHour'

export type WeekdayOpeningHoursType = {
  opening: string
  closing: string
}

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

  fastify.get('/:locationId/openingHours', async (request, reply) => {
    const queryParams = z.object({
      locationId: z.string(),
      slug: z.string()
    })
    const { locationId: strLocationId, slug } = queryParams.parse(
      request.params
    )

    const locationId = Number(strLocationId)

    const location = await prisma.location.findUnique({
      where: {
        id: locationId,
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

    const openingHour = await prisma.openingHour.findFirst({
      where: { locationId }
    })

    return reply.send({
      openingHour: openingHour ? handleOpeningHours(openingHour) : undefined
    })
  })

  fastify.patch(
    '/:locationId/openingHours',
    {
      onRequest: [authenticate, salonAdmin]
    },
    async (request, reply) => {
      const queryParams = z.object({
        locationId: z.string(),
        slug: z.string()
      })
      const { locationId: strLocationId, slug } = queryParams.parse(
        request.params
      )

      const locationId = Number(strLocationId)

      let location = await prisma.location.findUnique({
        where: {
          id: locationId,
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

      const dayScheme = z
        .object({ opening: z.string(), closing: z.string() })
        .nullable()

      const bodyScheme = z.object({
        id: z.number().optional(),
        sunday: dayScheme,
        monday: dayScheme,
        tuesday: dayScheme,
        wednesday: dayScheme,
        thursday: dayScheme,
        friday: dayScheme,
        saturday: dayScheme
      })

      const { id, ...weekOpeningHours } = bodyScheme.parse(request.body)

      const data: Prisma.OpeningHourUncheckedCreateInput = {
        locationId
      }
      const weekdays = Object.keys(weekOpeningHours)

      for (const weekday of weekdays) {
        const day = weekday as keyof typeof weekOpeningHours
        const dayOpeningHours = weekOpeningHours[
          day
        ] as WeekdayOpeningHoursType | null
        data[`${day}OpeningHours`] = dayOpeningHours?.opening || null
        data[`${day}ClosingHours`] = dayOpeningHours?.closing || null
      }

      const openingHour = id
        ? await prisma.openingHour.update({
            data,
            where: { id }
          })
        : await prisma.openingHour.create({ data })

      return reply.send({
        status: true,
        openingHour: handleOpeningHours(openingHour)
      })
    }
  )
}
