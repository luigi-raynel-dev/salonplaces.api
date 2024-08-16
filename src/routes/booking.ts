import { FastifyInstance } from 'fastify'
import { custom, number, z } from 'zod'
import { prisma } from '../lib/prisma'
import {
  generateTimeSlots,
  handleOpeningHours,
  interval,
  weekdays
} from '../modules/openingHour'
import dayjs from 'dayjs'
import { WeekdayOpeningHoursType } from './location'
import { authenticate } from '../plugins/authenticate'
import { JWTPayload } from '../modules/auth'
import { getTimeSlots } from '../modules/booking'

export async function bookingRoutes(fastify: FastifyInstance) {
  fastify.get('/:bookingId', async (request, reply) => {
    const queryParams = z.object({
      slug: z.string(),
      locationId: z.string(),
      bookingId: z.string().uuid()
    })
    const { bookingId: id, locationId: strLocationId } = queryParams.parse(
      request.params
    )

    const locationId = Number(strLocationId)

    let booking = await prisma.booking.findFirst({
      include: {
        customer: {
          include: {
            user: {
              include: {
                gender: true
              }
            }
          }
        },
        professional: {
          include: {
            user: {
              include: {
                gender: true
              }
            }
          }
        },
        service: true,
        location: true
      },
      where: {
        id,
        locationId
      }
    })

    if (!booking)
      return reply.status(404).send({
        status: false,
        error: 'BOOKING_NOT_FOUND'
      })

    return { booking }
  })

  fastify.post('/times', async (request, reply) => {
    const queryParams = z.object({
      slug: z.string(),
      locationId: z.string()
    })
    const { slug, locationId: strLocationId } = queryParams.parse(
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

    if (!openingHour)
      return {
        timeSlots: [],
        reason: 'UNDEFINED_OPENING_HOURS'
      }

    const bodyScheme = z.object({
      date: z.string(),
      professionalsIds: z.array(z.string()),
      servicesIds: z.array(z.number())
    })

    const { date, professionalsIds, servicesIds } = bodyScheme.parse(
      request.body
    )

    if (professionalsIds.length === 0)
      return {
        timeSlots: [],
        reason: 'UNDEFINED_PROFESSIONALS'
      }

    if (servicesIds.length === 0)
      return {
        timeSlots: [],
        reason: 'UNDEFINED_SERVICES'
      }

    const openingHours = handleOpeningHours(openingHour)

    const now = dayjs()
    const day = dayjs(date, 'YYYY-MM-DD HH:mm:ss')
    const weekday = weekdays[day.day()]
    const weekdayHours = openingHours[weekday] as WeekdayOpeningHoursType | null

    if (now.diff(day) > 0)
      return reply.status(400).send({
        status: false,
        error: 'INVALID_DATE'
      })

    if (!weekdayHours)
      return {
        timeSlots: [],
        reason: 'CLOSED'
      }

    const services = await prisma.service.findMany({
      where: {
        id: {
          in: servicesIds
        },
        active: true,
        salonId: location.salonId
      }
    })

    if (services.length === 0)
      return reply.status(404).send({
        status: false,
        error: 'SERVICES_NOT_FOUND_OR_UNAVAILABLE'
      })

    const timeSlots = await getTimeSlots(
      weekdayHours,
      services,
      professionalsIds,
      locationId,
      day
    )

    return {
      timeSlots
    }
  })

  fastify.post(
    '/',
    {
      onRequest: [authenticate]
    },
    async (request, reply) => {
      const queryParams = z.object({
        slug: z.string(),
        locationId: z.string()
      })
      const { slug, locationId: strLocationId } = queryParams.parse(
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

      const { email } = request.user as JWTPayload

      const user = await prisma.user.findUniqueOrThrow({
        where: { email }
      })

      const customer = await prisma.customer.findUnique({
        where: { userId: user.id }
      })

      if (!customer)
        return reply.status(400).send({
          status: false,
          error: 'UNREGISTERED_CUSTOMER'
        })

      const bodyScheme = z.object({
        datetime: z.string(),
        professionalId: z.string(),
        serviceId: z.number(),
        observation: z.string().nullable().optional()
      })

      const { datetime, professionalId, serviceId, observation } =
        bodyScheme.parse(request.body)

      const service = await prisma.service.findUnique({
        where: {
          id: serviceId,
          active: true,
          salonId: location.salonId
        }
      })

      if (!service)
        return reply.status(404).send({
          status: false,
          error: 'SERVICE_NOT_FOUND'
        })

      if (!service.active)
        return reply.status(400).send({
          status: false,
          error: 'DISABLED_SERVICE'
        })

      const professional = await prisma.professional.findUnique({
        where: { id: professionalId }
      })

      if (!professional)
        return reply.status(404).send({
          status: false,
          error: 'PROFESSIONAL_NOT_FOUND'
        })

      if (!professional.online)
        return reply.status(400).send({
          status: false,
          error: 'PROFESSIONAL_OFFLINE'
        })

      const locationHasProfessional =
        await prisma.locationHasProfessional.findUnique({
          where: {
            locationId_professionalId: {
              locationId,
              professionalId
            }
          }
        })

      if (!locationHasProfessional)
        return reply.status(400).send({
          status: false,
          error: 'LOCATION_HAS_NOT_PROFESSIONAL'
        })

      const salonHasProfessional = await prisma.salonHasProfessional.findUnique(
        {
          where: {
            salonId_professionalId: {
              salonId: location.salonId,
              professionalId
            }
          }
        }
      )

      if (!salonHasProfessional)
        return reply.status(400).send({
          status: false,
          error: 'SALON_HAS_NOT_PROFESSIONAL'
        })

      if (!salonHasProfessional.active)
        return reply.status(400).send({
          status: false,
          error: 'DISABLED_PROFESSIONAL'
        })

      const openingHour = await prisma.openingHour.findFirst({
        where: { locationId }
      })

      if (!openingHour)
        return {
          status: [],
          error: 'UNDEFINED_OPENING_HOURS'
        }

      const openingHours = handleOpeningHours(openingHour)

      const now = dayjs()
      const day = dayjs(datetime, 'YYYY-MM-DD HH:mm')
      const hour = day.format('HH:mm')

      if (now.diff(day) > 0)
        return reply.status(400).send({
          status: false,
          error: 'INVALID_DATE'
        })

      const weekday = weekdays[day.day()]
      const weekdayHours = openingHours[
        weekday
      ] as WeekdayOpeningHoursType | null

      if (!weekdayHours)
        return reply.status(400).send({
          satsus: false,
          error: 'CLOSED'
        })

      const timeSlots = await getTimeSlots(
        weekdayHours,
        [service],
        [professionalId],
        locationId,
        day
      )

      if (!timeSlots.includes(hour))
        return reply.status(400).send({
          satsus: false,
          error: 'UNAVAILABLE_TIME'
        })

      const booking = await prisma.booking.create({
        data: {
          customerId: customer.id,
          locationId,
          serviceId,
          professionalId,
          datetime: day.toDate(),
          observation
        }
      })

      return {
        status: true,
        booking
      }
    }
  )

  fastify.patch(
    '/:bookingId',
    {
      onRequest: [authenticate]
    },
    async (request, reply) => {
      const queryParams = z.object({
        slug: z.string(),
        locationId: z.string(),
        bookingId: z.string().uuid()
      })
      const {
        slug,
        locationId: strLocationId,
        bookingId
      } = queryParams.parse(request.params)

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

      const { email } = request.user as JWTPayload

      const user = await prisma.user.findUniqueOrThrow({
        where: { email }
      })

      const customer = await prisma.customer.findUnique({
        where: { userId: user.id }
      })

      if (!customer)
        return reply.status(400).send({
          status: false,
          error: 'UNREGISTERED_CUSTOMER'
        })

      let booking = await prisma.booking.findFirst({
        where: {
          id: bookingId,
          locationId,
          customerId: customer.id
        }
      })

      if (!booking)
        return reply.status(404).send({
          status: false,
          error: 'BOOKING_NOT_FOUND'
        })

      const bodyScheme = z.object({
        datetime: z.string(),
        observation: z.string().nullable().optional(),
        canceled: z.boolean().default(false).nullable().optional(),
        rating: z.number().max(5).nullable().optional(),
        ratingReason: z.string().nullable().optional()
      })

      const { datetime, ...data } = bodyScheme.parse(request.body)

      const service = await prisma.service.findUnique({
        where: {
          id: booking.serviceId,
          salonId: location.salonId
        }
      })

      if (!service)
        return reply.status(404).send({
          status: false,
          error: 'SERVICE_NOT_FOUND'
        })

      const openingHour = await prisma.openingHour.findFirst({
        where: { locationId }
      })

      if (!openingHour)
        return {
          status: [],
          error: 'UNDEFINED_OPENING_HOURS'
        }

      const openingHours = handleOpeningHours(openingHour)

      const now = dayjs()
      const day = dayjs(datetime, 'YYYY-MM-DD HH:mm')
      const hour = day.format('HH:mm')

      if (!dayjs(booking.datetime).isSame(day) && now.diff(day) > 0)
        return reply.status(400).send({
          status: false,
          error: 'INVALID_DATE'
        })

      const weekday = weekdays[day.day()]
      const weekdayHours = openingHours[
        weekday
      ] as WeekdayOpeningHoursType | null

      if (!weekdayHours)
        return reply.status(400).send({
          satsus: false,
          error: 'CLOSED'
        })

      if (!dayjs(booking.datetime).isSame(day)) {
        const timeSlots = await getTimeSlots(
          weekdayHours,
          [service],
          [booking.professionalId],
          locationId,
          day
        )

        if (!timeSlots.includes(hour))
          return reply.status(400).send({
            satsus: false,
            error: 'UNAVAILABLE_TIME'
          })
      }

      booking = await prisma.booking.update({
        data: {
          customerId: customer.id,
          locationId,
          datetime: day.toDate(),
          updatedAt: new Date(),
          ...data
        },
        where: {
          id: booking.id
        }
      })

      return {
        status: true,
        booking
      }
    }
  )
}
