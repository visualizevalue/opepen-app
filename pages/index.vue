<template>
  <div class="home">
    <h1>The <span class="nowrap">Opepen Meta</span></h1>

    <!-- <aside v-if="viewPreviews" class="previews">
      <SetPreview :id="1" />
      <SetPreview :id="2" />
    </aside> -->

    <section>
      <FeaturedGallery />
    </section>
  </div>
</template>

<script setup>
// import { SET_TIMESTAMPS } from '~/helpers/sets'
// import { nowInSeconds } from '~/helpers/time'

// const viewPreviews = SET_TIMESTAMPS['1'] < nowInSeconds() || true
</script>

<style lang="postcss" scoped>
  h1 {
    text-align: center;
    color: var(--gray-z-8);
    font-size: var(--font-display);
    letter-spacing: var(--letter-spacing-sm);
    font-weight: var(--font-weight-bold);
    margin: 8vh 0 15vh;
    line-height: 1em;

    .nowrap {
      white-space: nowrap;
    }
  }

  aside,
  section {
    width: 100%;
    max-width: var(--content-width);
    margin: var(--size-5) auto;
  }

  aside {
    display: grid;
    grid-template-columns: 100%;
    gap: var(--size-4);
    margin: calc(-1 * max(8vh, var(--size-5))) auto max(8vh, var(--size-5));
    margin: 0 auto max(8vh, var(--size-5));

    > * {
      width: 100%;
    }

    @media (--md) {
      gap: var(--size-8);
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin: max(8vh, var(--size-8)) auto;
    }
  }
</style>
