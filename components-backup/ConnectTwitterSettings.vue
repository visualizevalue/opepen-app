<template>
  <p class="label">Connect Twitter/X</p>

  <Button @click="connectX" type="button">
    <Icon type="x.com" />
    <span v-if="user">
      Connected to <span class="nowrap">@{{ user.username }}</span>
    </span>
    <span v-else>Connect With Opepen</span>
  </Button>
  <Button v-if="false" @click="() => connectX('write')" type="button">
    <Icon type="x.com" />
    <span v-if="user">
      Connected to <span class="nowrap">@{{ user.username }}</span>
    </span>
    <span v-else>Connect With Opepen</span>
  </Button>
</template>

<script setup>
const config = useRuntimeConfig()

const props = defineProps({
  user: Object,
})

const connectX = async (scope = 'read') => {
  const { url } = await $fetch(`${config.public.opepenOauthApi}/connect/twitter?scope=${scope}`, { credentials: 'include' })

  location.replace(url)
}
</script>
