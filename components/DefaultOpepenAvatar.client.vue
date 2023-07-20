<template>
  <img :src="img" alt="Default Opepen Avatar" />
</template>

<script setup>
import { createIcon } from 'opepen-standard'

const canvas = createIcon({ // All options are optional
    seed: 'randstring', // seed used to generate icon data, default: random
    // color: '#dfe', // optional
    // bgcolor: '#aaa', // optional
    size: 32, // width/height of the icon in blocks, default: 32
})

const img = canvas.toDataURL()
</script>

<style lang="postcss" scoped>
  img {
    border-radius: 50%;
    border: var(--border);
  }
</style>
