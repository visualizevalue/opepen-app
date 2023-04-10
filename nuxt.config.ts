// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:site',
          content: '@opepenai',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0, user-scalable=0'
        }
      ],
      link: [
        {
          href: '/favicon.png',
          rel: 'shortcut icon',
          type: 'image/png',
        },
        {
          href: '/favicon.png',
          rel: 'apple-touch-icon',
        },
      ],
    }
  },
  runtimeConfig: {
    public: {
      opepenApi: '',
    },
  },
  css: [
    '~/styles/index.css',
  ],
  postcss: {
    plugins: {
      'postcss-nested': {},
      'postcss-custom-selectors': {
        importFrom: 'styles/custom-selectors.css',
      },
      'postcss-custom-media': {
        importFrom: 'styles/custom-media.css',
      },
      'postcss-preset-env': {
        stage: 3,
        features: {},
      },
      'autoprefixer': {},
    },
  },
})
