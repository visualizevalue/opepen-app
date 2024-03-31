import { DateTime } from 'luxon'

export const formatDate = (date) => {
  return DateTime.fromISO(date)
    .setLocale('en')
    .toLocaleString(DateTime.DATE_MED)
}

export const formatDateTime = (date) => {
  return DateTime.fromISO(date).toLocaleString({ year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
}

export const formatTime = (date) => {
  return DateTime.fromISO(date).toLocaleString({ hour: 'numeric', minute: 'numeric' })
}
