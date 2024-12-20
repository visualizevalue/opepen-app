<template>
  <span>{{ timeStr }}</span>
</template>

<script setup>
import { useIntervalFn } from '@vueuse/core'
import { timeAgo } from '~/helpers/dates'

const props = defineProps({
  timestamp: String,
})

const timeStr = ref(timeAgo(props.timestamp))

useIntervalFn(() => timeStr.value = timeAgo(props.timestamp), 1000)
</script>
