<template>
  <div>
    <AdminSetSubmissions />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Administrate set submissions',
})
</script>

<style lang="postcss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

article {
  max-width: var(--content-width);
  margin: 0 auto;
}
</style>
