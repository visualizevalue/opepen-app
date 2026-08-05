<template>
  <ClientOnly>
    <PageFrameLg class="submission">
      <div class="set-layout">
        <div class="artwork">
          <SetEditLink :submission="submission" />

          <SetPreviewImages :submission="submission" class="items" />
        </div>

        <div class="details">
          <SetItemsMeta :submission="submission" />

          <section v-if="submission.richContentLinks?.length" class="deep-dive">
            <SectionTitle>Deep Dive</SectionTitle>
            <RichContentLinks :links="submission.richContentLinks" />
          </section>

          <SetOptInCard :submission="submission" @update="refresh" />

          <SetOptInStatsCard :submission="submission" :last-updated="lastUpdated" />

          <SetOptInHistory :submission="submission" />

          <SetDynamicImagesPreview
            v-if="submission.edition_type === 'DYNAMIC'"
            :data="submission"
          />

          <SetParticipation :submission="submission" @refresh="refresh" />
        </div>
      </div>
    </PageFrameLg>
  </ClientOnly>
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
  },
})
watchEffect(() => {
  if (!data.value?.uuid) return
  submission.value = data.value
})

// Update every 2 minutes
let refreshInterval
onMounted(() => {
  refreshInterval = window.setInterval(() => {
    refresh()
  }, 1000 * 120)
})
onBeforeUnmount(() => window.clearInterval(refreshInterval))

useMetaData({
  title: `${submission.value?.name} | Set Submission | Opepen`,
  description: shortenedCleanText(submission.value?.description),
  og: `${useApiBase()}/render/sets/${submission.value?.uuid}/og?${new URLSearchParams(route.query)}`,
})
</script>

<style scoped>
.submission {
  display: block;
}

/*
 * The grid lives on .set-layout, not on .submission: .submission is the frame
 * that declares `container-name: page`, and an element cannot query its own
 * container. The name is prefixed because .layout is the global app shell.
 */
.set-layout {
  display: grid;
  align-content: start;
  gap: var(--spacer-lg);
  max-width: var(--content-width-sm);
  margin: 0 auto;

  > *:last-child {
    margin-bottom: var(--spacer-lg);
  }
}

.artwork,
.details {
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
  row-gap: var(--spacer-lg);
  min-width: 0;

  @media (--md) {
    gap: var(--spacer-lg);
  }
}

/*
 * Wide screens: pin the editions beside the data instead of above it, so the
 * artwork stays on screen while demand, history and participation scroll.
 */
@container page (min-width: 56rem) {
  .set-layout {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
    column-gap: var(--spacer-xl);
    max-width: none;
  }

  .artwork {
    position: sticky;
    /* Matches main's padding plus the frame's, so the columns line up at rest.
     * This layout only applies wide, where the nav is the sidebar, not a top bar. */
    top: calc(var(--spacer-lg) + var(--spacer));
    /* Keep the square mosaic inside the viewport so sticky has somewhere to go. */
    max-width: min(100%, calc(100dvh - var(--spacer-lg) * 2 - var(--spacer) * 2));
  }
}

.deep-dive {
  display: grid;
  gap: var(--spacer);
}
</style>
