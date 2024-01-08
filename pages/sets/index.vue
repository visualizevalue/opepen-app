<template>
  <div>
    <section v-if="activeSets.length">
      <SectionTitle>Active Sets</SectionTitle>
      <SetPreview v-for="set in activeSets" :set="set" :key="set.id" />
    </section>

    <section class="grid">
      <SectionTitle>All Sets</SectionTitle>
      <SetPreview v-for="set in completeSets" :set="set" :key="set.id" minimal />
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
  }

  h1 {
    margin: var(--size-5) 0;
  }

  &.grid {

    @media (--md) {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--size-5);

      h1 {
        grid-column: 1 / -1;
        margin-bottom: 0;
      }

      article {
        width: 100%;
      }
    }

    @media (--lg) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
</style>
