<template>
  <section class="permanent-collection">
    <div>
      <Progress :percent="parseInt(completeSets.length / 200 * 100)">
        {{ completeSets.length }} / 200
      </Progress>
      <div class="grid">
        <SetPreview v-for="set in completeSets" :data="set.submission" :key="set.id" minimal />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useSets } from '~/helpers/sets'
import { useMetaData } from '~/helpers/head'

const { completeSets } = useSets()

useMetaData({
  title: 'Opepen Sets',
  og: 'https://opepen.nyc3.cdn.digitaloceanspaces.com/OG/sets.png',
})
</script>

<style scoped>
.permanent-collection {
  padding: 0 var(--size-4);

  > div {
    max-width: var(--content-width);
    margin-left: auto;
    margin-right: auto;
  }
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
</style>
