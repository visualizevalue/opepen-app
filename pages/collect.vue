<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  async middleware () {
    const { submission, optInAvailable } = await useStagedSet()

    if (! optInAvailable.value) return navigateTo(`/submissions`)

    return navigateTo(`/submissions/${submission.value.uuid}`)
  }
})
</script>
