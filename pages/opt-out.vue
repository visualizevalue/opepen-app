<template>
  <div class="burned">
    <section class="about">
      <header>
        <h1>Consensus Met</h1>
        <p>Opt out from the Opepen consensus protocol.</p>
        <p>This process is irreversible, and opted out tokens will no longer be able participate in the consensus building process.</p>
        <p>These artifacts will be issued by a separate Ethereum contract, with a maximum supply of 16,000.</p>
      </header>

      <BurnOpepenForm />
    </section>

    <section class="gallery-section">
      <div class="gallery">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2001.png" alt="Consensus Met Preview 1">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2002.png" alt="Consensus Met Preview 2">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2003.png" alt="Consensus Met Preview 3">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2004.png" alt="Consensus Met Preview 4">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2010.png" alt="Consensus Met Preview 5">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2006.png" alt="Consensus Met Preview 6">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2007.png" alt="Consensus Met Preview 7">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2008.png" alt="Consensus Met Preview 8">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2009.png" alt="Consensus Met Preview 9">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2010.png" alt="Consensus Met Preview 10">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2011.png" alt="Consensus Met Preview 11">
        <img src="https://ipfs.vv.xyz/ipfs/QmPuJ5Hxm9ArZud5PZ3ch684EYw9fiiA1Nyi4b1cuwRvsi/Burned%20Opepen%2012.png" alt="Consensus Met Preview 12">
      </div>
    </section>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Opt-Out: Consensus Met',
  description: 'Opt out from the Opepen consensus protocol. This process is irreversible, and opted out tokens will no longer be able participate in the consensus building process.',
  og: 'https://opepen.nyc3.cdn.digitaloceanspaces.com/OG/og-burned.jpg',
})
</script>

<style lang="postcss" scoped>
.burned {
  max-width: var(--content-width);
  margin: 0 auto;
  display: grid;
  gap: var(--size-9);

  .about {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--size-5);

    h1 {
      margin: 0 0 0.5em;
      font-size: var(--font-title);
    }

    p {
      margin-bottom: 0.5em;
      color: var(--gray-z-7);
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
