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
import { useSets } from '~/helpers/sets'

const { activeSets, completeSets } = useSets()
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
