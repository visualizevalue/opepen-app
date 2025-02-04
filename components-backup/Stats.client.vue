<template>
  <div>
    <slot :stats="stats" />
  </div>
</template>

<script setup>
import { useStats } from '~/helpers/stats'

const { data: stats } = await useStats()
</script>
