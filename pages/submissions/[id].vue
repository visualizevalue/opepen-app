<template>
  <ClientOnly>
    <PageFrameLg class="submission">
      <div class="set-layout">
        <div class="artwork">
          <SetEditLink :submission="submission" />

          <div class="cell art-cell">
            <SetPreviewImages :submission="submission" class="items" />
          </div>

          <div class="cell">
            <SetItemsMeta :submission="submission" />
          </div>
        </div>

        <div class="details">
          <section v-if="submission.richContentLinks?.length" class="cell deep-dive">
            <SectionTitle>Deep Dive</SectionTitle>
            <RichContentLinks :links="submission.richContentLinks" />
          </section>

          <div class="cell">
            <SetOptInCard :submission="submission" @update="refresh" />
          </div>

          <div class="cell">
            <SetOptInStatsCard :submission="submission" :last-updated="lastUpdated" />
          </div>

          <div class="cell">
            <SetOptInHistory :submission="submission" />
          </div>

          <div v-if="submission.edition_type === 'DYNAMIC'" class="cell">
            <SetDynamicImagesPreview :data="submission" />
          </div>

          <div class="cell">
            <SetParticipation :submission="submission" @refresh="refresh" />
          </div>
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
/*
 * Full bleed: cancel main's horizontal padding so the rules run to the edges of
 * the content area rather than floating inside it.
 */
.submission {
  display: block;
  max-width: none;
  padding: 0;
  width: calc(100% + var(--main-padding-x) * 2);
  margin-left: calc(-1 * var(--main-padding-x));
  border-top: var(--border);
}

/*
 * The grid lives on .set-layout, not on .submission: .submission is the frame
 * that declares `container-name: page`, and an element cannot query its own
 * container. The name is prefixed because .layout is the global app shell.
 */
.set-layout {
  display: grid;
  align-content: start;
}

.artwork,
.details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Every section is a bordered cell; the shared hairlines form the grid. */
.cell {
  padding: var(--spacer-lg) var(--main-padding-x);
  border-bottom: var(--border);
  min-width: 0;
}

.art-cell {
  padding: var(--main-padding-x);
}

.deep-dive {
  display: grid;
  gap: var(--spacer);
}

/*
 * The nested components ship their own card chrome. Flatten it so the cell
 * borders are the only rules on the page. Vertical padding is left alone:
 * the demand card uses its own padding-top to clear an absolute progress bar.
 */
.cell :deep(.card) {
  padding-left: 0;
  padding-right: 0;
  border: 0;
  background: transparent;
  height: auto;
}

/*
 * Wide screens: pin the editions and set info beside the data instead of above
 * it, so the artwork stays on screen while demand and history scroll.
 */
@container page (min-width: 56rem) {
  .set-layout {
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    align-items: start;
  }

  /* The rule sits on the taller column so it runs the full height of the grid. */
  .details {
    border-left: var(--border);
  }

  .artwork {
    position: sticky;
    top: 0;
    /* Sticky only helps while the column fits; scroll it internally if not. */
    max-height: 100dvh;
    overflow-y: auto;
    scrollbar-width: none;
  }

  .artwork::-webkit-scrollbar {
    display: none;
  }
}
</style>
