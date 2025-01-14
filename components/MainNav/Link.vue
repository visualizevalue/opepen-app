<template>
  <NuxtLink v-bind="$attrs">
    <span>{{ title }}</span>
    <small>{{ subline }}</small>
  </NuxtLink>
</template>

<script setup>
defineProps({
  title: String,
  subline: String,
})
</script>

