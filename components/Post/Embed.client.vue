<template>
  <Loading v-if="loading" />
  <Image v-else-if="isImage" :image="embed.image" />
  <article v-else class="embed">
    <Image v-if="embed.image" :image="embed.image" />
    <div v-if="embed.title" class="text">
      <h1>{{ embed.title }}</h1>
      <p v-if="embed.description">{{ embed.description }}</p>
    </div>
    <a v-if="embed.title" :href="embed.url" target="_blank"><span>View {{ embed.title }}</span></a>
  </article>
</template>

<script setup>
const { url } = defineProps({
  url: String,
})

const config = useRuntimeConfig()

const embed = ref()
const isImage = computed(() => embed.value.image && !embed.value.title)
const loading = ref(false)
const load = async () => {
  loading.value = true
  embed.value = await $fetch(`${config.public.opepenApi}/open-graph-data?url=${encodeURI(url)}`)
  loading.value = false
}

onMounted(async () => {
  load()
})
</script>

<style lang="postcss" scoped>
.embed {
  position: relative;
  border: var(--border);
  border-radius: var(--size-4);
  border-top-left-radius: var(--size-1);
  overflow: hidden;

  :deep(.image) {
    border: none;
    border-radius: 0 !important;
  }

  .text {
    padding: var(--size-2) var(--spacer);

    p {
      color: var(--gray-z-6);
      font-size: var(--font-sm);
    }

    h1,
    p {
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  a {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    span {
      opacity: 0;
    }
  }
}
</style>
