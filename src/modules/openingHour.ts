import { OpeningHour } from '@prisma/client'
import { WeekdayOpeningHoursType } from '../routes/location'

export const interval = Number(process.env.INTERVAL_TIME || '10')

export const weekdays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
]

export const handleOpeningHours = (openingHours: OpeningHour) => {
  const data: Record<string, WeekdayOpeningHoursType | null | number> = {
    id: openingHours.id
  }

  for (const weekday of weekdays) {
    const openingKey = `${weekday}OpeningHours` as keyof typeof openingHours
    const closingKey = `${weekday}ClosingHours` as keyof typeof openingHours
    const opening = openingHours[openingKey] as string | null
    const closing = openingHours[closingKey] as string | null
    data[weekday] = opening && closing ? { opening, closing } : null
  }

  return data
}

export const timeStringToMinutes = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

export const generateTimeSlots = (bussines: WeekdayOpeningHoursType) => {
  const slots = []
  const startTime = timeStringToMinutes(bussines.opening)
  const endTime = timeStringToMinutes(bussines.closing)

  for (let time = startTime; time <= endTime; time += interval) {
    const hours = Math.floor(time / 60)
    const minutes = time % 60
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`
    slots.push(formattedTime)
  }

  return slots
}
