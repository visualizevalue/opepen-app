<template>
  <div>
    <NuxtPage :account="account" />
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const route = useRoute()
const url = `${config.public.opepenApi}/accounts/${route.params.id}`
const { data: account } = await useFetch(url)
</script>

