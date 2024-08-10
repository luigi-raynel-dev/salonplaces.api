import { OpeningHour } from '@prisma/client'
import { WeekdayOpeningHoursType } from '../routes/location'

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
