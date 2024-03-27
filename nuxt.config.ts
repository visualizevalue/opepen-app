// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:site',
          content: '@opepenedition',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0'
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
      opepenOauthApi: '',
      signatureApi: 'https://api.signature.vv.xyz/v1',
      opepenContract: '0x6339e5e072086621540d0362c4e3cea0d643e114',
      rpc: 'http://127.0.0.1:8545',
      alchemy: '',
      walletConnectProjectId: '',
      chainName: 'mainnet',
      chainId: '1',
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
  vite: {
    server: {
      hmr: {
        overlay: false,
      }
    }
  }
})
