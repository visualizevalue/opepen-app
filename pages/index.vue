<template>

  <PageFrameSm>
    <h1>
      <span>Opepen Edition</span>
      <small>Public Art On Ethereum</small>
    </h1>

    <hr>

    <section class="intro">
      <div>
        <h2>
          <span>One Symbol</span>
          <small>By Visualize Value</small>
        </h2>
        <Image image="/wireframe.svg" />
      </div>
      <div>
        <h2>
          <span>Infinite Remixes</span>
          <small>By Anyone</small>
        </h2>
        <Image image="/submissions.png" />
      </div>
      <div>
        <h2>
          <span>200 Final Sets</span>
          <small>By Collector Vote</small>
        </h2>
        <Image image="/sets.png" />
      </div>
    </section>

    <hr>
  </PageFrameSm>

</template>

<script setup lang="ts">
</script>

<style scoped>
  h1,
  h2,
  p {
    @mixin ui-font;
    font-size: var(--font-lg);
    line-height: 1em;

    small {
      font-size: 1em;
      color: var(--muted);
    }
  }

  h1 {
    display: grid;
    gap: var(--spacer-sm);
    justify-content: center;
    text-align: center;
    padding: var(--spacer-lg) 0 calc(var(--spacer-lg) + var(--spacer));
    padding: var(--spacer-lg) 0;

    @container (min-width: 30rem) {
      display: flex;
      justify-content: space-between;
      text-align: left;
    }
  }

  .intro {
    display: grid;
    gap: var(--spacer-xl);
    padding: var(--spacer-xl) 0;

    > div {
      display: grid;
      gap: var(--spacer);
      justify-content: center;
      align-items: flex-start;
      text-align: center;

      h2 {
        display: grid;
        font-size: var(--font-md);
        gap: var(--spacer-xs);
      }

      > * {
        width: min(69cqw, 20rem);
      }
    }

    @container (min-width: 38rem) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--spacer-lg);
      /* padding: var(--spacer-lg) 0; */

      > div {
        > * {
          width: calc(33cqw - var(--spacer));
        }
      }
    }
  }
</style>

