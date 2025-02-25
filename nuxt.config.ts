import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  alias: {
    '@vv': '@visualizevalue/vveb3-layer',
  },

  css: [
    '@vv/assets/styles/index.css',
    join(currentDir, './styles/index.css'),
  ],

  extends: [
    '@visualizevalue/vveb3-layer',
  ],

  modules: [
    '@tresjs/nuxt',
    '@vite-pwa/nuxt',
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover'
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
      domain: 'opepen.art',
      title: 'Opepen',
      description: 'Consensus is temporary',
      blockExplorer: 'https://etherscan.io',
      chainId: 1,
      rpc1: 'https://eth.llamarpc.com',
      rpc2: 'https://ethereum-rpc.publicnode.com',
      rpc3: 'https://eth.drpc.org',
      walletConnectProjectId: '',
      burnedOpepenContract: '0x53787D1Fee8512C6dF258EBdf65903E2EA371222',
      opepenContract: '0x6339e5e072086621540d0362c4e3cea0d643e114',
      opepenApi: '',
      opepenOauthApi: '',
      signatureApi: 'https://api.signature.vv.xyz/v1',
    }
  },

  pwa: {
    devOptions: {
      enabled: false,
    },
    manifest: {
      name: 'Opepen Edition',
      short_name: 'Opepen',
      description: 'Consensus is temporary',
      theme_color: '#000000',
      start_url: '/sets',
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
