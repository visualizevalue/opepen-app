<template>
  <div>
    <SectionTitle>My Sets</SectionTitle>

    <div class="submissions">
      <MySetSubmissions />
    </div>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'My set submissions',
})
</script>

<style lang="postcss" scoped>
</style>
