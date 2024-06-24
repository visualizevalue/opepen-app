<template>
  <div>
    <SectionTitle>My Single Posts</SectionTitle>
    <MySinglePosts />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Single Opepen Posts',
})
</script>

<style lang="postcss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submissions {
  max-width: var(--content-width);
  margin: 0 auto;
}
</style>
