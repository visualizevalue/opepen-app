<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  async middleware () {
    const { data } = await useApi(`/set-submissions/curated`)

    return navigateTo(`/submissions/${data.value.submission.uuid}`)
  }
})
</script>
