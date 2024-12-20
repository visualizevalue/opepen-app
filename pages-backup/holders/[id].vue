<template>
</template>

<script setup>
const route = useRoute()
await navigateTo(`/${route.params.id}`, { redirectCode: 301 })
</script>
