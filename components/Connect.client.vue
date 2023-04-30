<template>
  <Button v-if="! isConnected" @click="open = true" id="main-connect">
    <slot>Connect</slot>
  </Button>
  <Button :to="`/holders/${address}`" v-else>
    <Account :address="address" class="connected" />
  </Button>

  <Modal
    :open="open"
    @close="open = false"
    title="Connect Wallet"
  >
    <ChooseWallet />
  </Modal>
</template>

<script setup>
import { useAccount } from 'vagmi'

const { address, isConnected } = useAccount()

const open = ref(false)
watch(isConnected, () => {
  open.value = false
})
</script>

<style lang="postcss" scoped>
.avatar {
  margin-left: calc(-1 * var(--size-2));

  :deep(img) {
    border-top-left-radius: var(--size-0);
  }
}
</style>
