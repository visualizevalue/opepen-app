// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
