<template>
  <div class="set">
    <SetPagination :set="set" />
    <SetPreviewImages :set="set" class="items" />
    <SetAbout :set="set" />
    <SetStats :set="set" class="stats" />
    <SetItemsMeta :set="set" />
    <SetStatsMeta :set="set" />
    <SetOptIn :set="set" @update="refresh" />
    <SetOpepen :set="set" />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'
import pad from '~/helpers/pad'

const config = useRuntimeConfig()

const route = useRoute()
const setId = parseInt(route.params.id)

const url = `${config.public.opepenApi}/opepen/sets/${setId}`
const { data: set, refresh } = await useFetch(url)

useMetaData({
  title: `Set ${pad(set.value.id, 3)}: ${set.value.name || 'Locked'} | Opepen`,
  description: set.value.description || `Opepen Set ${pad(set.value.id, 3)} is one of 200 official Opepen sets.`,
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
                "pagination"
                "items"
                "items-meta"
                "about"
                "opt-in"
                "details"
                "details-meta"
                "opepen";

    @media (--md) {
      display: grid;
      gap: var(--size-7);
      row-gap: var(--size-8);
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-rows: min-content;
      grid-auto-flow: dense;
      grid-template-areas:
                  "pagination pagination"
                  "items details"
                  "items-meta details-meta"
                  "about about"
                  "opt-in opt-in"
                  "opepen opepen";
    }

    .pagination { grid-area: pagination; }
    .items { grid-area: items; }
    .opt-in { grid-area: opt-in; }
    .items-meta { grid-area: items-meta; }
    .details-meta { grid-area: details-meta; }
    .set-opepen { grid-area: opepen; }
    .about { grid-area: about; }
  }

  .items,
  .stats {
    display: grid;
    aspect-ratio: 1;
  }
</style>
