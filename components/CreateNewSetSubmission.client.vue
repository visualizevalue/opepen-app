<template>
  <Loading />
</template>

<script setup>
const { data: set } = await useApi(`/set-submissions`, {
  method: 'POST',
  credentials: 'include',
})

await navigateTo(`/create/${set.value.uuid}`, { replace: true })
</script>
