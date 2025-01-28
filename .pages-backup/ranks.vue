<template>
  <div>
    <header>
      <h1>
        <span>Opepoll</span>
        <small>Cast votes on your favorite opepen</small>
      </h1>
    </header>

    <section>
      <!-- <SectionTitle>Leaderboard</SectionTitle> -->
      <p>🏗️ VVIP 🏗️</p>
    </section>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Opepen Ranks',
  og: 'https://opepen.nyc3.cdn.digitaloceanspaces.com/OG/ranks@frame.png',
  meta: [
    { property: 'fc:frame', content: 'vNext' },
    {
      property: 'fc:frame:image',
      content: 'https://opepen.nyc3.cdn.digitaloceanspaces.com/OG/ranks@frame.png',
    },
    { property: 'fc:frame:button:1', content: 'Cast Votes' },
    { property: 'fc:frame:post_url', content: 'https://api.opepen.art/v1/frames/ranks/vote' },
  ],
})
</script>

<style scoped>
header,
section {
  /* max-width: var(--content-width); */
  margin: var(--size-8) auto 0;

  &:first-child {
    margin-top: var(--size-5);
  }
}

header {
  h1 {
    small, span {
      display: block;
    }

    small {
      color: var(--gray-z-6);
      text-transform: uppercase;
      margin-bottom: var(--size-2);
      font-size: var(--font-md);
    }

    span {
      font-family: var(--ui-font-family);
      font-size: var(--font-title);
      line-height: var(--line-height-md);
      letter-spacing: 0.05em;

      @media (--md) {
        font-size: var(--font-display);
      }
    }
  }
}

section {
  text-align: center;
}
</style>
