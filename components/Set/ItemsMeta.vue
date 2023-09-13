<template>
  <aside v-if="set.name" class="items-meta">
    <article>
      <h1>Release</h1>
      <p>{{ pad(set.id, 3) }}</p>
    </article>
    <article>
      <h1>Set</h1>
      <p>{{ set.name }}</p>
    </article>
    <article>
      <h1>Artist</h1>
      <p>{{ set.artist }}</p>
    </article>
    <article>
      <h1>Editions</h1>
      <p>{{ TYPES[set.type] }}</p>
    </article>
  </aside>
</template>

<script setup>
import pad from '~/helpers/pad'

const TYPES = {
  PRINT: 'Prints',
  NUMBERED_PRINT: 'Numbered Prints',
  DYNAMIC: 'Dynamic'
}

defineProps({
  set: Object,
})
</script>

<style lang="postcss" scoped>
  .items-meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: calc(-1 * var(--size-4));
    /* box-shadow: var(--border-shadow);
    border-radius: var(--size-5);
    border-top-left-radius: var(--size-1);
    overflow: hidden; */

    article {
      /* background-color: var(--gray-z-0);
      box-shadow: var(--border-shadow); */
      /* padding: var(--size-2) var(--size-4); */
      font-weight: var(--font-weight-bold);
      font-size: var(--font-sm);

      h1 {
        color: var(--gray-z-6);
      }

      h1,
      p {
        text-transform: uppercase;
        line-height: 1.25;
        margin-bottom: var(--size-3);
      }

      @media (--md) {
        display: grid;
        grid-template-columns: 35% 65%;
        gap: var(--size-2);
      }
    }

    @media (--md) {
      margin-top: calc(-1 * var(--size-6));
    }
  }
</style>
