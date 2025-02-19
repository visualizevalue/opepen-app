<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  async middleware () {
    const { submission, optInAvailable } = await useStagedOptIn()

    if (! optInAvailable.value) return navigateTo(`/submissions`, { replace: true, redirectCode: 302 })

    return navigateTo(`/submissions/${submission.value.uuid}`, { replace: true, redirectCode: 302 })
  }
})
</script>
