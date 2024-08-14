import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import {
  generateTimeSlots,
  handleOpeningHours,
  interval,
  weekdays
} from '../modules/openingHour'
import dayjs from 'dayjs'
import { WeekdayOpeningHoursType } from './location'

export async function bookingRoutes(fastify: FastifyInstance) {
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

    const day = dayjs(date, 'YYYY-MM-DD HH:mm:ss')
    const weekday = weekdays[day.day()]
    const weekdayHours = openingHours[weekday] as WeekdayOpeningHoursType | null

    if (!weekdayHours)
      return {
        timeSlots: [],
        reason: 'CLOSED'
      }

    const timeSlots = generateTimeSlots(weekdayHours)

    const services = await prisma.service.findMany({
      where: {
        id: {
          in: servicesIds
        }
      }
    })

    let totalTime = 0
    for (const service of services) {
      totalTime += service.minutes
    }
    const slotsToRemove = totalTime / interval
    timeSlots.splice(-slotsToRemove)

    const bookings = await prisma.booking.findMany({
      include: {
        service: true
      },
      where: {
        locationId,
        canceled: false,
        professionalId: {
          in: professionalsIds
        },
        datetime: {
          gte: day.startOf('day').toDate(),
          lt: day.endOf('day').toDate()
        }
      }
    })

    for (const booking of bookings) {
      const bookingTime = dayjs(booking.datetime).format('HH:mm')
      let canRemoveSlots = true
      if (professionalsIds.length > 1) {
        const otherProfessionalsIds = professionalsIds.filter(
          professionalId => professionalId !== booking.professionalId
        )
        const bookingsInSameHour = await prisma.booking.findMany({
          include: {
            service: true
          },
          where: {
            locationId,
            canceled: false,
            professionalId: {
              in: otherProfessionalsIds
            },
            datetime: booking.datetime
          }
        })

        canRemoveSlots =
          bookingsInSameHour.length === otherProfessionalsIds.length
      }

      if (canRemoveSlots) {
        const timeSlotIndex = timeSlots.findIndex(
          timeSlot => timeSlot === bookingTime
        )

        timeSlots.splice(timeSlotIndex, booking.service.minutes / interval)
      }
    }

    return {
      timeSlots
    }
  })
}
