<template>
  <div>
    <Settings />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: `User Settings`,
})
</script>

<style lang="postcss" scoped>
div {
  max-width: var(--content-width-sm);
  margin: var(--size-6) auto;
}
</style>
