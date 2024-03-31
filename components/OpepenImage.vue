<template>
  <Image v-if="token.image" :image="token.image" :version="version" :embed="embed" />
  <article v-else-if="token.metadata?.image" class="image loaded">
    <div class="inner">
      <img :src="normalizeURI(token.metadata.image)" :alt="`Rare 1/${edition} Opepen Preview ${token.token_id}`" class="loaded">
    </div>
  </article>
  <article v-else class="image loaded">
    <div class="inner">
      <img :src="`https://ipfs.vv.xyz/ipfs/QmVXvZ5Sp6aSDBrWvtJ5gZ3bwNWRqqY3iPvyF8nveWj5HF/${edition}.svg`" :alt="`Rare 1/${edition} Opepen Preview ${token.token_id}`" class="loaded">
    </div>
  </article>
</template>

<script setup>
import { normalizeURI } from '~/helpers/urls'

const { token, version } = defineProps({
  token: Object,
  embed: String,
  version: {
    type: String,
    default: 'sm'
  },
})

const edition = computed(() => token.data?.edition || 40)
</script>
