<template>
  <Button v-if="! isConnected" @click="open = true" id="main-connect">
    <span class="avatar">
      <DefaultOpepenAvatar />
    </span>
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
.avatar {
  margin-left: calc(-1 * var(--size-2));

  :deep(img) {
    border-top-left-radius: var(--size-0);
    width: var(--size-5);
    height: var(--size-5);
  }
}
</style>
