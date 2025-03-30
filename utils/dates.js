import { DateTime } from 'luxon'

export const formatDate = (date) => {
  return DateTime.fromISO(date).setLocale('en').toLocaleString(DateTime.DATE_MED)
}

export const formatDateTime = (date) => {
  return DateTime.fromISO(date).setLocale('en-US').toLocaleString({
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

export const formatTime = (date) => {
  return DateTime.fromISO(date)
    .setLocale('en-US')
    .toLocaleString({ hour: 'numeric', minute: 'numeric' })
}

export const timeAgo = (time) => {
  return DateTime.now().diff(time).as('days') > 2
    ? formatDate(time)
    : time.toRelative({ style: 'short', locale: 'us' })
}
