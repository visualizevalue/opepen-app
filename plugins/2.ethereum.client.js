import { defineNuxtPlugin } from '#app'

import {
  createConfig,
  configureChains,
  mainnet,
  InjectedConnector,
} from '@wagmi/core'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { publicProvider } from '@wagmi/core/providers/public'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // TODO: https://github.com/wagmi-dev/wagmi/issues/2511
  localStorage.setItem('wagmi.injected.shimDisconnect', 'true')

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet],
    [
      alchemyProvider({ apiKey: config.public.alchemy }),
      publicProvider(),
    ],
    {
      batch: { multicall: true },
      pollingInterval: 10_000,
    }
  )

  const wagmi = createConfig({
    autoConnect: true,
    connectors: [
      new InjectedConnector({ chains }),
      new MetaMaskConnector({ chains }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: config.public.walletConnectProjectId,
        },
      }),
    ],
    publicClient,
    webSocketPublicClient,
  })


  window.wagmi = wagmi

  return {
    provide: {
      wagmi
    }
  }
})
