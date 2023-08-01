import { DateTime } from 'luxon'

export const formatDate = (date) => {
  return DateTime.fromISO(date).toLocaleString({ month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
}
