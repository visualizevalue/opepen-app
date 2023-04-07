<template>
  <div>
    <h1>OpepenAI</h1>
    <button @click="() => toggleDark()">
      <Icon :type="isDark ? 'sun' : 'moon'" />
    </button>
  </div>
</template>

<script setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style lang="postcss" scoped>
  div,
  h1 {
    background-color: var(--background);
    color: var(--color);
  }
</style>
