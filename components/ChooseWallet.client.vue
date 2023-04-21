<template>
  <div>
    <button
      :disabled="!ic.ready"
      @click="connect(ic)"
      class="base"
    >
      <template v-if="ic.name === 'Coinbase Wallet'">
        <img src="/cbw.svg" :alt="ic.name" />
        {{ ic.name }}
      </template>
      <template v-else>
        <img src="/mm.svg" :alt="mm.name" />
        MetaMask
      </template>
      <small v-if="isConnecting && pendingConnector?.id === ic.id" class="tiny upper">connecting</small>
    </button>

    <button
      @click="connect(wc)"
      class="base"
    >
      <img src="/wc.svg" alt="WalletConnect" />
      {{ wc.name }}
      {{ isConnecting && pendingConnector?.id === wc.id ? ' (connecting)' : '' }}
    </button>

    <aside v-if="error" class="small">
      {{ error.message }}
    </aside>
  </div>
</template>

<script setup>
import { chain, useConnect } from 'vagmi'
import { InjectedConnector } from 'vagmi/connectors/injected'
import { MetaMaskConnector } from 'vagmi/connectors/metaMask'
import { WalletConnectConnector } from 'vagmi/connectors/walletConnect'

const config = useRuntimeConfig()

const ic = new InjectedConnector()
const mm = new MetaMaskConnector()
const wc = new WalletConnectConnector({
  chains: [chain.mainnet],
  options: {
    qrcode: true,
    rpc: {
      1: config.public.rpc,
    }
  },
})

const {
  connect,
  error,
  isConnecting,
  pendingConnector,
} = useConnect({ chainId: config.public.chainId })
</script>

<style lang="postcss" scoped>
  div {
    display: flex;
    flex-direction: column;
    gap: var(--size-4);

    @media (--md) {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }

  button {
    width: 100%;
    padding: var(--size-3);
    text-transform: uppercase;
    border: var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: baseline;
    transition: all var(--speed);
    background: var(--gray-z-1);
    font-weight: var(--font-weight-bold);
    border: var(--border-dark);
    border-radius: var(--size-3);
    border-top-left-radius: var(--size-1);

    img {
      height: 4.5rem;
      margin-bottom: var(--size-4);
    }

    &:--highlight {
      background-color: var(--gray-z-3);
    }

    &[disabled]:not([disabled=false]) {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  aside {
    text-align: center;
    grid-column: 1 / -1;
    padding: var(--size-2) var(--size-3);
    border: var(--border);
    border-color: var(--red);
    background: var(--red);
  }
</style>
