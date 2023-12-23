<template>
  <div class="set">
    <header>
      <SetPagination :set="set" />
      <EmailNotificationAlert />
      <SetReplacementNote :set="set" :replaced-submission="set.replacedSubmission" class="note" />
    </header>

    <SetPreviewImages :set="set" class="items" />
    <SetItemsMeta :set="set" />

    <!-- <SetAbout :set="set" /> -->
    <SetStats :set="set" class="stats" />
    <SetOptIn :set="set" @update="refresh" />
    <SetStatsMeta :set="set" />

    <SetOpepen :set="set" />

    <SetOptInComments :set="set" />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'
import pad from '~/helpers/pad'
import { cleanText } from '~/helpers/strings'

const config = useRuntimeConfig()

const route = useRoute()
const setId = parseInt(route.params.id)

const url = `${config.public.opepenApi}/opepen/sets/${setId}`
const { data: set, refresh } = await useFetch(url)

useMetaData({
  title: `Set ${pad(set.value.id, 3)}: ${set.value.name || 'Locked'} | Opepen`,
  description: cleanText(set.value.description) || `Opepen Set ${pad(set.value.id, 3)} is one of 200 official Opepen sets.`,
  og: set.value.name
    ? `https://opepen.nyc3.cdn.digitaloceanspaces.com/OG/sets/${pad(set.value.id, 3)}.png`
    : `https://opepen.art/og/rare.png`,
})
</script>

<style lang="postcss" scoped>
  .set {
    display: grid;
    gap: var(--size-4);
    row-gap: var(--size-7);
    max-width: var(--content-width);
    margin: 0 auto;
    grid-template-columns: 100%;
    grid-template-areas:
                "header"
                "items"
                "items-meta"
                /* "about" */
                "details"
                "details-meta"
                "opt-in"
                "opepen"
                "comments";


    @media (--md) {
      display: grid;
      gap: var(--size-7);
      row-gap: var(--size-9);
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-rows: min-content;
      grid-auto-flow: dense;
      grid-template-areas:
                  "header header"
                  "items items-meta"
                  /* "about about" */
                  "details opt-in"
                  "details-meta details-meta"
                  "opepen opepen"
                  "comments comments";
    }

    :deep() {
      > header {
        grid-area: header;
        display: flex;
        flex-direction: column;
        gap: var(--size-4);

        @media (--md) {
          gap: var(--size-7);
        }
      }
      > .items { grid-area: items; }
      > .stats { grid-area: details; }
      > .opt-in { grid-area: opt-in; }
      >.items-meta { grid-area: items-meta; }
      > .details-meta,
      > .stats-meta { grid-area: details-meta; }
      > .set-opepen { grid-area: opepen; }
      > .about { grid-area: about; }
      > .opt-in-comments { grid-area: comments; }
      > .opt-in + .opt-in-comments { grid-area: opepen; }
    }

  }

  .items,
  .stats {
    display: grid;
    aspect-ratio: 1;
  }
</style>
