import { Service } from '@prisma/client'
import { WeekdayOpeningHoursType } from '../routes/location'
import { generateTimeSlots, interval } from './openingHour'
import { prisma } from '../lib/prisma'
import dayjs from 'dayjs'

export const getTimeSlots = async (
  weekdayHours: WeekdayOpeningHoursType,
  services: Service[],
  professionalsIds: string[],
  locationId: number,
  day: dayjs.Dayjs
) => {
  const timeSlots = generateTimeSlots(weekdayHours)

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

  return timeSlots
}
