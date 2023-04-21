import { defineNuxtPlugin } from '#app'
import buffer from 'buffer'

// This also uses the server `polyfill` plugin...
export default defineNuxtPlugin(() => {
  if (process.server) return

  window.global = window
  window.Buffer = buffer.Buffer
})
