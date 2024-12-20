<template>
  <div>
    <header>
      <h1>
        <span>Merch</span>
      </h1>
    </header>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

onMounted(() => {
  window.location.replace('https://visualizevalue.com/collections/opepen')
})

useMetaData({
  title: 'Opepen Merch',
  og: 'https://api.opepen.art/v1/frames/merch/0/image',
  meta: [
    { property: 'fc:frame', content: 'vNext' },
    {
      property: 'fc:frame:image',
      content: 'https://api.opepen.art/v1/frames/merch/0/image',
    },
    { property: 'fc:frame:button:1', content: 'Add to Cart' },
    { property: 'fc:frame:button:2', content: 'Next →' },
    { property: 'fc:frame:post_url', content: 'https://api.opepen.art/v1/frames/merch/0' },
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
      font-family: var(--font-family-opepen);
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
