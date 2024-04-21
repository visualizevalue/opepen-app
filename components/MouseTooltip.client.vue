<template>
  <Teleport to="body">
    <aside :style="{
      left: x + 'px',
      top: y + 'px',
    }">
      <slot />
    </aside>
  </Teleport>
</template>

<script setup>
import { useMouse } from '@vueuse/core'

const { x, y } = useMouse()
</script>

<style lang="postcss" scoped>
aside {
  background: var(--gray-z-1);
  border: var(--border);
  border-radius: var(--size-2);
  border-top-left-radius: var(--size-0);
  padding: var(--size-4);
  position: absolute;
  z-index: 100;
  pointer-events: none;
}
</style>
