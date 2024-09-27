<template>
  <template v-if="stats && isAuthenticated">
    <p v-if="parseInt(stats.votes)">{{ formatNumber(stats.votes) }} curated</p>
    <p>{{ formatNumber(Math.max(stats.votable, 0)) }} to curate</p>
  </template>
</template>

<script setup>
import { formatNumber } from '~/helpers/format'
import { isAuthenticated } from '~/helpers/siwe'

const props = defineProps({
  refreshKey: Number,
})

const config = useRuntimeConfig()
const refreshKey = computed(() => props.refreshKey)

const { data: stats } = await useFetch(`${config.public.opepenApi}/votes/stats`, {
  credentials: 'include',
  watch: [ refreshKey ],
})
</script>
