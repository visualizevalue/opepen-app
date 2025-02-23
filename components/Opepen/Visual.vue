<template>
  <Image
    v-if="token.image"
    :image="token.image"
    :version="version"
    :embed="animationURI"
  />
  <article v-else class="image loaded">
    <div class="inner">
      <img
        :src="`https://ipfs.vv.xyz/ipfs/QmVXvZ5Sp6aSDBrWvtJ5gZ3bwNWRqqY3iPvyF8nveWj5HF/${edition}.svg`"
        :alt="`Rare 1/${edition} Opepen Preview ${token.token_id}`"
        class="loaded"
      >
    </div>
  </article>
</template>

<script setup>
const { token, version } = defineProps({
  token: Object,
  version: {
    type: String,
    default: 'sm'
  },
})

const edition = computed(() => token.data?.edition || 40)

const animationURI = computed(() => {
  if (! token.metadata?.animation_url) return

  return normalizeURI(token.metadata.animation_url)
})
</script>
