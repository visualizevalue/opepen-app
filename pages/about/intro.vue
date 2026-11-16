<template>
  <div></div>
</template>

<script setup lang="ts">
// The explainer now lives at /about. Keep this route for old links.
await navigateTo(`/about`, { redirectCode: 301 })
</script>
