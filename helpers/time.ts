import { DateTime, Duration } from 'luxon'

export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export const daysInSeconds = (days: number): number => days * 60 * 60 * 24

export const nowInSeconds = (): number => Math.floor(Date.now() / 1000)

export const asUTCDate = (date: Date|null) => date
  ? DateTime.utc(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
  : null

export const timeRemainingFromSeconds = (seconds: number) => {
  if (! seconds) return false

  const d = Duration.fromObject({ seconds: seconds }).shiftTo('hours', 'minutes', 'seconds')

  return `${d.hours}h ${d.minutes}m ${d.seconds}s`
}

export const BLOCKS_PER_DAY = 6200
export const BLOCKS_PER_WEEK = BLOCKS_PER_DAY * 7
export const BLOCKS_PER_2_WEEKS = BLOCKS_PER_WEEK * 2
