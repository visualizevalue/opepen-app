<template>
  <p class="label">Connect Twitter/X</p>

  <Button @click="connectX" type="button">
    <Icon type="x.com" />
    <span>Connect With Opepen</span>
  </Button>
</template>

<script setup>
const config = useRuntimeConfig()

const connectX = async () => {
  const { url } = await $fetch(`${config.public.opepenOauthApi}/connect/twitter`, { credentials: 'include' })

  location.replace(url)
}
</script>
