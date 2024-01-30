<template>
  <div>
    <header>
      <h1>Opepen Ranks</h1>
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
    { property: 'fc:frame:button:1', content: 'Start Voting' },
    { property: 'fc:frame:post_url', content: 'https://api.opepen.art/v1/frames/ranks/vote' },
  ],
})
</script>

<style lang="postcss" scoped>
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
    text-align: center;
    font-family: var(--font-family-opepen);
    font-size: var(--font-title);
    line-height: var(--line-height-md);
    letter-spacing: 0.05em;

    @media (--md) {
      font-size: var(--font-display);
    }
  }
}

section {
  text-align: center;
}
</style>
