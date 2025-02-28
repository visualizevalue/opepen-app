import { DateTime, Duration } from 'luxon'

export const BLOCKS_PER_DAY = 7200
export const BLOCKS_PER_WEEK = BLOCKS_PER_DAY * 7
export const BLOCKS_PER_2_WEEKS = BLOCKS_PER_WEEK * 2
export const DEFAULT_TIME_TO_REVEAL = 24 * 60 * 60 * 3 // 3 days
export const OPT_IN_HOURS = 72

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
  if (seconds == DEFAULT_TIME_TO_REVEAL) return false

  const d = Duration.fromObject({ seconds: seconds }).shiftTo('hours', 'minutes', 'seconds')

  return `${d.hours}h ${d.minutes}m ${d.seconds}s`
}

const now = ref(nowInSeconds())
let nowInterval: NodeJS.Timeout
export const useNow = () => {
  if (import.meta.client && ! nowInterval) {
    nowInterval = setInterval(() => {
      now.value = nowInSeconds()
    }, 1000)
  }

  return now
}

export const useCountDown = (s: Ref<Number|BigInt>) => {
  const duration = computed(() => Math.abs(parseInt(`${s.value}`)))

  const seconds = computed(() => duration.value % 60)
  const minutes = computed(() => Math.floor(duration.value / 60) % 60)
  const hours   = computed(() => Math.floor(duration.value / 60 / 60) % 24)
  const days    = computed(() => Math.floor(duration.value / 60 / 60 / 24))

  const str = computed(() => [
    days.value    ? `${days.value}d`   : null,
    hours.value   ? `${hours.value}h`   : null,
    minutes.value ? `${minutes.value}m` : null,
    (duration.value < 24 * 60 * 60) && seconds.value
      ? `${seconds.value}s`
      : null,
  ].filter(s => !!s).join(' '))

  return {
    seconds,
    minutes,
    hours,
    str,
  }
}

