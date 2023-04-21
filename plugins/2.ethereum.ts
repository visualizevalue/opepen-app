import { defineNuxtPlugin } from '#app'
import { chain, configureChains, createClient, VagmiPlugin } from 'vagmi'
import { alchemyProvider } from 'vagmi/providers/alchemy'
import { jsonRpcProvider } from 'vagmi/providers/jsonRpc'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()

  const { provider } = configureChains(
    [
      chain.mainnet,
    ],
    [
      jsonRpcProvider({
        rpc: () => ({
          http: config.public.rpc,
        })
      }),
      alchemyProvider({ alchemyId: config.public.alchemy }),
    ]
  )

  const client = createClient({
    autoConnect: true,
    provider,
  })

  const vagmi = VagmiPlugin(client)

  nuxtApp.vueApp.use(vagmi)
  nuxtApp.vueApp.provide(Symbol('vagmi'), vagmi)

  return {
    provide: {
      vagmi,
    }
  }
})
