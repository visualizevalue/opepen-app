<template>
  <div class="home">
    <h1>The Opepen Meta</h1>

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
    font-size: var(--size-8);
    letter-spacing: var(--letter-spacing-sm);
    font-weight: var(--font-weight-bold);
    margin: 8vh 0 15vh;
    line-height: 1em;
  }

  section {
    width: 100%;
    max-width: var(--content-width);
    margin: var(--size-5) auto;
  }
</style>
