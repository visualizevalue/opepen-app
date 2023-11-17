<template>
  <Image v-if="token.image" :image="token.image" :version="version" :embed="embed" />
  <article v-else class="image loaded">
    <div class="inner">
      <img :src="`https://opepen.nyc3.cdn.digitaloceanspaces.com/images/rare/${edition}.svg`" :alt="`Rare 1/${edition} Opepen Preview ${token.token_id}`" class="loaded">
    </div>
  </article>
</template>

<script setup>
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
