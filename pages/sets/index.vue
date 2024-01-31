<template>
  <div>
    <section v-if="activeSets.length">
      <SectionTitle>Active Sets</SectionTitle>
      <SetPreview v-for="set in activeSets" :set="set" :key="set.id" />
    </section>

    <section>
      <SectionTitle>All Sets</SectionTitle>
      <Progress :percent="parseInt(completeSets.length / 200 * 100)">
        {{ completeSets.length }} / 200
      </Progress>
      <div class="grid">
        <SetPreview v-for="set in completeSets" :set="set" :key="set.id" minimal />
      </div>
    </section>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'
import { useSets } from '~/helpers/sets'

const { activeSets, completeSets } = useSets()

useMetaData({
  title: 'Opepen Sets',
  og: 'https://opepen.nyc3.cdn.digitaloceanspaces.com/OG/sets.png',
  meta: [
    { property: 'fc:frame', content: 'vNext' },
    { property: 'fc:frame:image', content: 'https://opepen.nyc3.cdn.digitaloceanspaces.com/OG/sets@frame.png' },
    { property: 'fc:frame:button:1', content: 'View Website' },
    { property: 'fc:frame:button:1:action', content: 'post_redirect' },
    { property: 'fc:frame:button:2', content: 'Browse Sets' },
    { property: 'fc:frame:post_url', content: 'https://api.opepen.art/v1/frames/sets' },
  ]
})
</script>

<style lang="postcss" scoped>
section {
  max-width: var(--content-width);
  margin: var(--size-8) auto 0;

  &:first-child {
    margin-top: var(--size-5);

    .set-preview:not(:last-child) {
      margin-bottom: var(--size-5);
    }
  }

  h1 {
    margin: var(--size-5) 0;
  }

  .progress {
    margin: var(--size-7) 0 var(--size-8);
  }

  .grid {
    display: grid;
    gap: var(--size-5);

    article {
      width: 100%;
    }

    @media (--md) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (--lg) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
</style>
