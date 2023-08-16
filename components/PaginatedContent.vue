<template>
  <div>
    <slot :items="items" :meta="meta" :loading="loading" />

    <slot name="loading">
      <Loading v-if="loading" />
    </slot>

    <aside
      v-if="hasMore && !loading"
      ref="scrollMarker"
      v-intersection-observer="onMarkerVisible"
    ></aside>
  </div>
</template>

<script setup>
import { vIntersectionObserver } from '@vueuse/components'
import { get } from '~/api'

const props = defineProps({
  url: String,
  query: String,
  metaAccessor: {
    type: Function,
    default: d => d.meta,
  },
  itemsAccessor: {
    type: Function,
    default: d => d.data,
  },
  refreshKey: [Number, String],
})

const {
  metaAccessor,
  itemsAccessor,
} = props
const refreshKey = computed(() => props.refreshKey)
const url = computed(() => props.url)
const query = computed(() => props.query || '')
const page = ref(0)
const loading = ref(false)
const items = ref([])
const meta = ref({})

const hasMore = computed(() => page.value < meta.value?.last_page)

const loadMore = async () => {
  loading.value = true

  try {
    page.value += 1

    let queryParams = query.value.trim()
    if (queryParams) {
      queryParams += `&page=${page.value}`
    } else {
      queryParams = `page=${page.value}`
    }

    const result = await get(`${url.value}?${queryParams}`)

    meta.value = metaAccessor(result)
    const newItems = itemsAccessor(result)
    if (newItems?.length) {
      items.value = items.value.concat(itemsAccessor(result))
    }
  } catch (e) {
    console.log(e)
  }

  loading.value = false
}

// Reset everything if the url changes
const reset = () => {
  page.value = 0
  items.value = []

  loadMore()
}
watch([query, url, refreshKey], () => reset())

// Scroll marker autoloading
function onMarkerVisible ([{ isIntersecting }]) {
  if (! isIntersecting) return
  if (! hasMore.value) return

  loadMore()
}

defineExpose({
  items,
})

// Load initial data
await loadMore()
</script>

<style lang="postcss" scoped>
div {
  position: relative;

  aside {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 25vh;
  }
}
</style>
