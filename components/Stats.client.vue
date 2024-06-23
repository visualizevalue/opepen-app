<template>
  <slot :stats="stats" />
</template>

<script setup>
import { useStats } from '~/helpers/stats'

const { data: stats } = await useStats()
</script>
