<template>
  <SinglePostsGallery v-if="session" :address="session?.address?.toLowerCase()" />
</template>

<script setup>
import { session } from '~/helpers/siwe'
</script>
