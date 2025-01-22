<template>
  <Dropdown
    :items="[
      { onClick: () => navigateTo(`/${address}`) && $emit('sendClose'), text: 'Profile', icon: 'user' },
      { onClick: () => navigateTo('/settings') && $emit('sendClose'), text: 'Settings', icon: 'settings' },
      { onClick: () => disconnect(), text: 'Disconnect', icon: 'log-out' },
    ]"
    :x-offset="isDesktop ? 8 : -8"
    class="settings"
    align="right"
  >
    <template #trigger>
      <Icon type="more-vertical" />
    </template>
  </Dropdown>
</template>

<script setup>
import { useDisconnect } from '@wagmi/vue'
import { useAccount } from '@wagmi/vue'

const { address } = useAccount()
const { disconnect } = useDisconnect()
const { isDesktop } = useWindow()

defineEmits(['sendClose'])
</script>

<style scoped>
.settings {
  position: absolute;
  top: var(--size-4);
  right: var(--size-4);
  top: var(--size-2);
  right: 0;
  color: var(--gray-z-5);
  transition: color var(--speed);
  z-index: 1;

  .trigger {
    margin-left: auto;
    display: block;
  }

  .icon {
    width: var(--size-4);
    height: var(--size-4);
  }

  &:--highlight {
    color: var(--color);
  }
}
</style>

