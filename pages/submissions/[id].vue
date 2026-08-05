<template>
  <ClientOnly>
    <PageFrameLg class="submission">
      <div class="set-layout">
        <div class="artwork">
          <div class="cell">
            <SetItemsMeta :submission="submission" />
          </div>

          <div class="cell art-cell">
            <SetPreviewImages :submission="submission" class="items" />
          </div>
        </div>

        <div class="details">
          <section v-if="submission.richContentLinks?.length" class="cell deep-dive">
            <SectionTitle>Deep Dive</SectionTitle>
            <RichContentLinks :links="submission.richContentLinks" />
          </section>

          <SetOptInCard class="cell" :submission="submission" @update="refresh" />

          <SetOptInStatsCard
            class="cell"
            :submission="submission"
            :last-updated="lastUpdated"
          />

          <SetOptInChart class="cell" :submission="submission" />

          <SetOptInHistory class="cell" :submission="submission" />

          <SetDynamicImagesPreview
            v-if="submission.edition_type === 'DYNAMIC'"
            class="cell"
            :data="submission"
          />

          <SetParticipation class="cell" :submission="submission" @refresh="refresh" />
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

/*
 * Update every 2 minutes, but only while the tab is visible. This endpoint
 * returns the whole submission including every participation image (megabytes
 * on a busy set), so polling it in a background tab is pure waste. On return,
 * refresh straight away if the data is already older than the interval.
 */
const REFRESH_INTERVAL = 120

let refreshInterval
const refreshIfVisible = () => {
  if (document.hidden) return

  refresh()
}
const onVisibilityChange = () => {
  if (document.hidden) return
  if (nowInSeconds() - lastUpdated.value < REFRESH_INTERVAL) return

  refresh()
}

onMounted(() => {
  refreshInterval = window.setInterval(refreshIfVisible, REFRESH_INTERVAL * 1000)
  document.addEventListener('visibilitychange', onVisibilityChange)
})
onBeforeUnmount(() => {
  window.clearInterval(refreshInterval)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

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
 * Wide, the nav is the sidebar rather than a fixed top bar, so main's top
 * padding is just an empty band above the grid. Pull the grid up into it.
 */
@media (--lg) {
  .submission {
    margin-top: calc(-1 * var(--main-padding-top));
    border-top: 0;
  }
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

/*
 * Stacked, the vote card keeps its original position below the artwork and set
 * info. Wide, it is hoisted into a full-width band across the top.
 */
.artwork {
  order: 1;
}
.vote-bar {
  order: 2;
}
.details {
  order: 3;
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
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
  }

  .vote-bar {
    order: 0;
    grid-column: 1 / -1;
  }

  /* The rule sits on the taller column so it runs the full height of the grid. */
  .details {
    order: 2;
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
