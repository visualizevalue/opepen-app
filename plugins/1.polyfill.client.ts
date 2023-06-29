import { defineNuxtPlugin } from '#app'
import buffer from 'buffer'

// This also uses the server `polyfill` plugin...
export default defineNuxtPlugin(() => {
  window.global = window
  window.Buffer = buffer.Buffer
})
