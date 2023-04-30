<template>
  <div class="home">
    <h1>The <span class="nowrap">Opepen Meta</span></h1>

    <section>
      <FeaturedGallery />
    </section>
  </div>
</template>

<script setup>
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

  section {
    width: 100%;
    max-width: var(--content-width);
    margin: var(--size-5) auto;
  }
</style>
