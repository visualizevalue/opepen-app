<template>
  <nav>

    <!-- Profile -->
    <Connect>
      <template #connected>
        <NuxtLink to="/">Profile</NuxtLink>
      </template>
    </Connect>


    <!-- About -->
    <NuxtLink to="/about">About</NuxtLink>


    <!-- Browse -->


    <!-- Submit -->


    <!-- Community -->


  </nav>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
const aspectRatio = computed(() => width.value / height.value)

const isDesktop = computed(() => width.value >= 1024)
</script>

