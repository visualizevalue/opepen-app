// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover'
        },
        { name: 'theme-color', content: '#000000' },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:site',
          content: '@opepenedition',
        }
      ],
      link: [
        {
          rel: 'icon',
          href: '/favicon.ico',
          sizes: '48x48'
        },
        {
          rel: 'icon',
          href: '/icon.svg',
          sizes: 'any',
          type: 'image/svg+xml'
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon-512x512.png'
        },
      ]
    }
  },

  runtimeConfig: {
    public: {
      opepenApi: '',
      opepenOauthApi: '',
      signatureApi: 'https://api.signature.vv.xyz/v1',
      opepenContract: '0x6339e5e072086621540d0362c4e3cea0d643e114',
      burnedOpepenContract: '0x53787d1fee8512c6df258ebdf65903e2ea371222',
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
  },

  modules: [
    '@tresjs/nuxt',
    '@vite-pwa/nuxt',
  ],

  pwa: {
    devOptions: {
      enabled: false,
    },
    manifest: {
      name: 'Opepen',
      short_name: 'Opepen',
      description: 'Opepen Web Application',
      theme_color: '#000000',
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
    },
  },

  compatibilityDate: '2024-12-17',
})