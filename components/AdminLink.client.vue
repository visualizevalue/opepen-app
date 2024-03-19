<template>
  <Button v-if="isAdmin" to="/create/sets/admin">
    <Icon type="key" />
    <span>Administrate Sets</span>
  </Button>
</template>

<script setup>
import { isAdmin } from '~/helpers/siwe'
</script>

<style lang="postcss" scoped>

</style>
