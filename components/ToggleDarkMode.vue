<template>
  <button @click="() => toggleDark()">
    <Icon :type="isDark ? 'sun' : 'moon'" :size="20" />
  </button>
</template>

<script setup>
import { useDark, useToggle, useWindowSize } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style lang="postcss" scoped>
  button {
    position: fixed;
    bottom: var(--size-4);
    right: var(--size-4);
    height: var(--size-5);
    width: var(--size-5);
    outline: none;
  }
</style>
