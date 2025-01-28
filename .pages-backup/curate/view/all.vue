<template>
  <div>
    <Tabs
      :active="filter"
      :tabs="[
        { key: 'all', txt: 'All' },
        { key: 'sets', txt: 'Sets' },
        { key: 'submissions', txt: 'Submissions' },
        { key: 'singles', txt: 'Singles' },
      ]"
      @select="filter = $event"
    />

    <SinglesGallery
      path="opepen/images/curated"
      :query="query"
      @click="activate"
    >
      <template #item="{ item }">
        <ImageDetailSm @click="() => activate(item)" :image="item" />
      </template>
    </SinglesGallery>

    <ImageDetailModal :image="active" @close="deactivate" />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

const active = ref(null)

const activate = item => {
  active.value = item
}
const deactivate = () => {
  active.value = null
}

const route = useRoute()
const filter = ref(route.query.filter || 'all')
const query = computed(() => {
  const q = new URLSearchParams({
    filter: filter.value,
  })

  return q.toString()
})

useMetaData({
  title: 'Curated Opepen',
})
</script>
