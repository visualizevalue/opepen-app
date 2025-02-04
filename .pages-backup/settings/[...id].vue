<template>
  <div class="full">
    <SettingsForm />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: `User Settings`,
})
</script>

<style scoped>
</style>
