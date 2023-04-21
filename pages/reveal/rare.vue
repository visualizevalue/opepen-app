<template>
  <div class="reveal scroll">
    <header>
      <h1>
        <small>Reveal</small>
        <span>Rare Opepen</span>
      </h1>
    </header>

    <section>
      <div>
        <OpepenPack
          :reveal-time="revealTime"
        />
      </div>
      <!-- <div>
        <OpepenPack
          :reveal-time="revealTime"
        />
      </div> -->
    </section>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

const revealTime = 1682121600

useMetaData({
  title: 'Rare Opepen',
  description: 'Reveal your Rare Opepen Cards.',
  og: 'https://opepen.art/og/rare.png',
})
</script>

<style lang="postcss" scoped>
.reveal {
  padding: var(--size-4);
  user-select: none;
}

header {
  text-align: center;
  padding: var(--size-6) 0;

  h1 {
    font-size: var(--font-title);
    text-transform: uppercase;
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-md);
    line-height: var(--line-height-md);

    small {
      display: block;
      color: var(--gray-z-6);
      margin: 0 0 var(--size-2);
    }
  }
}

section {
  padding: 0 var(--size-4);
  margin: 5vh 0;
  display: flex;
  justify-content: center;

  > div {
    width: 100%;
    max-width: min(50vw, calc(50vh / 1.5));
  }
}
</style>
