<template>
  <PageFrameSm class="submission">
    <SetEditLink :submission="submission" />

    <SetPreviewImages :submission="submission" class="items" />

    <SetItemsMeta :submission="submission" />

    <SetOptInCard :submission="submission" @update="refresh" />

    <SetOptInStatsCard :submission="submission" :last-updated="lastUpdated" />

    <section v-if="submission.richContentLinks?.length" class="deep-dive">
      <SectionTitle>Deep Dive</SectionTitle>
      <RichContentLinks :links="submission.richContentLinks" />
    </section>

    <SetDynamicImagesPreview
      v-if="submission.edition_type === 'DYNAMIC'"
      :data="submission"
    />
  </PageFrameSm>
</template>

<script setup>
definePageMeta({
  middleware: 'enter-submission',
})

const route = useRoute()

const submission = ref()
const lastUpdated = ref(nowInSeconds())
const { data, refresh } = await useApi(`/set-submissions/${route.params.id}`, {
  onResponse: () => {
    lastUpdated.value = nowInSeconds()
  }
})
watchEffect(() => {
  if (! data.value?.uuid) return
  submission.value = data.value
})
await useStagedOptIn()

// Update every 2 minutes
onMounted(() => {
  setInterval(() => {
    refresh()
  }, 1000 * 120)
})

useMetaData({
  title: `${submission.value?.name} | Set Submission | Opepen`,
  description: shortenedCleanText(submission.value?.description),
  og: `${useApiBase()}/render/sets/${submission.value?.uuid}/og?${new URLSearchParams(route.query)}`,
})
</script>

<style scoped>
  .submission {
    display: flex;
    flex-direction: column;
    gap: var(--spacer);
    row-gap: var(--spacer-lg);
    max-width: var(--content-width-sm);
    margin: 0 auto;

    @media (--md) {
      gap: var(--spacer-lg);
    }

    > *:last-child {
      margin-bottom: var(--spacer-lg);
    }
  }

  .deep-dive {
    display: grid;
    gap: var(--spacer);
  }
</style>
