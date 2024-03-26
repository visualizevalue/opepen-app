<template>
  <Button v-if="! isConnected" @click="open = true" id="main-connect">
    <DefaultOpepenAvatar class="avatar" />
    <slot>Check-In</slot>
  </Button>
  <div v-else>
    <ButtonGroup>
      <Button :to="`/holders/${'address', address}`">
        <Account :address="address" />
      </Button>
      <Button to="/settings"><Icon type="settings" /></Button>
    </ButtonGroup>
  </div>

  <Modal
    :open="open"
    @close="open = false"
    title="Connect Wallet"
  >
    <ChooseWallet />
  </Modal>

  <Modal
    :open="signingIn"
    title="Signing In"
    :click-outside="false"
    :x-close="false"
  >
    <p>Requesting "Sign In With Ethereum" confirmation...</p>
  </Modal>
</template>

<script setup>
import { useSignIn } from '~/helpers/siwe'
import { useAccount } from '~/helpers/use-wagmi'

const { address, isConnected } = useAccount()
const { signIn, signingIn } = useSignIn()

const open = ref(false)
watch(isConnected, async () => {
  open.value = false

  if (isConnected.value) {
    signIn()
  }
})
</script>

<style lang="postcss" scoped>
:deep(.avatar) {
  margin-left: calc(-2 * var(--size-2) - 1px);
  width: var(--size-7);
  height: var(--size-7);
  border-top-left-radius: var(--size-1);

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
