<template>
  <slot :stats="stats" />
</template>

<script setup>
const config = useRuntimeConfig()

const { id } = defineProps({ id: Number })

const { data: stats } = await useFetch(`${config.public.opepenApi}/opepen/sets/${id}/stats`)
</script>
