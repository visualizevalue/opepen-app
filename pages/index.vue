<template>
  <div class="home">
    <OpepenTitle title="The Opepen Meta" class="title" />

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
  .title {
    color: var(--gray-z-8);
    margin: 8vh auto 15vh;
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
