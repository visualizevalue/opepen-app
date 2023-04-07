<template>
  <div>
    <h1>OpepenAI</h1>
  </div>
</template>

<script>
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
