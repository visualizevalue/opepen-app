<template>
  <div class="burned">
    <section class="about">
      <header>
        <h1>
          <span>Burned Opepen</span>
          <small>Opt-Out Opepen tokens and receive a Burned Opepen memorabilia.</small>
        </h1>
      </header>

      <BurnOpepenForm />
    </section>

    <section class="gallery-section">
      <div class="gallery">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2001.png" alt="Burned Opepen 1">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2002.png" alt="Burned Opepen 2">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2003.png" alt="Burned Opepen 3">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2004.png" alt="Burned Opepen 4">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2005.png" alt="Burned Opepen 5">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2006.png" alt="Burned Opepen 6">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2007.png" alt="Burned Opepen 7">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2008.png" alt="Burned Opepen 8">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2009.png" alt="Burned Opepen 9">
      </div>
    </section>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Burned Opepen',
  description: 'Opt-Out Opepen tokens and receive a Burned Opepen memorabilia.',
  og: 'https://opepen.nyc3.cdn.digitaloceanspaces.com/OG/og-burned.jpg',
})
</script>

<style lang="postcss" scoped>
.burned {
  max-width: var(--content-width);
  margin: 0 auto;
  display: grid;
  gap: var(--size-7);

  .about {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--size-7);
  }

  h1 {
    span {
      font-family: var(--font-display);
      font-size: var(--font-xl);
    }
    small {
      display: block;
      font-size: var(--font-base);
      color: var(--gray-z-6);
    }
  }

  .gallery-section {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .gallery {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      grid-auto-flow: dense;
      grid-auto-rows: min-content;
      justify-content: center;
      align-items: center;
      gap: var(--size-4);
    }
  }

  @media (--md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
