<template>
  <template v-if="stats">
    <p>{{ formatNumber(stats.votes) }} curated</p>
    <p>{{ formatNumber(stats.votable - stats.votes) }} to curate</p>
  </template>
</template>

<script setup>
import { formatNumber } from '~/helpers/format'

const props = defineProps({
  refreshKey: Number,
})

const config = useRuntimeConfig()
const refreshKey = computed(() => props.refreshKey)

const { data: stats, refresh } = await useFetch(`${config.public.opepenApi}/votes/stats`, {
  credentials: 'include',
  watch: [ refreshKey ],
})
</script>
