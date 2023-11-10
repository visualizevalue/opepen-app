<template>
  <div class="home">
    <div class="schematics">
      <OpepenSchematics />
    </div>

    <h1 class="title">
      <span>An Open Canvas</span>
      <small>Art that makes artists</small>
      <!-- <small>“Every block of stone has a statue inside it and it is the task of the sculptor to discover it.” <span class="muted">- Michelangelo</span></small> -->
    </h1>

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
  .schematics {
    width: 100%;
    max-width: min(24rem, 40vh);
    margin: calc(-1 * var(--navbar-height)) auto 0;
    position: relative;
    z-index: -1;

    svg {
      margin-bottom: -20%;
      width: 100%;
    }

    &:after {
      content: '';
      position: absolute;
      z-index: 1;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      box-shadow: inset 0 0 3rem 1rem var(--background);
      background: linear-gradient(to bottom, var(--transparent-background) 75%, var(--background));
    }
  }

  .title {
    color: var(--gray-z-8);
    margin: 8vh auto 15vh;
    text-align: center;

    > span,
    > small {
      line-height: var(--line-height-md);
      margin-left: auto;
      margin-right: auto;
    }

    > span {
      font-family: var(--font-family-opepen);
      font-size: var(--font-display);
      letter-spacing: 0.05em;
    }

    > small {
      display: block;
      font-size: var(--font-lg);
      margin-top: 0.5em;
      max-width: 30rem;

      .muted {
        color: var(--gray-z-6);
      }
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
