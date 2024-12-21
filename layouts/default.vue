<template>
  <div class="layout">

    <!-- Sidebar -->
    <MainNav :fixed="isDesktop" />

    <!-- Main App Frame -->
    <main>
      <slot />
    </main>

  </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
const aspectRatio = computed(() => width.value / height.value)

const isDesktop = computed(() => width.value >= 1024)
</script>
