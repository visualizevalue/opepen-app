import {
  defineConfig,
  minimal2023Preset as preset,
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: {
    ...preset,
    maskable: {
      ...preset.maskable,
      resizeOptions: { fit: 'contain', background: 'black' }
    },
    apple: {
      ...preset.maskable,
      resizeOptions: { fit: 'contain', background: 'black' }
    },
  },
  images: ['public/icon.svg']
})
