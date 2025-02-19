<template>
  <label>
    <span>Connect X.com</span>

    <Button @click="() => connectX()" type="button">
      <Icon type="x.com" />
      <span v-if="user">
        Connected to <span class="nowrap">@{{ user.username }}</span>
      </span>
      <span v-else>Connect your X Account</span>
    </Button>

    <Button v-if="false" @click="() => connectX('write')" type="button">
      <Icon type="x.com" />
      <span v-if="user">
        Connected to <span class="nowrap">@{{ user.username }}</span>
      </span>
      <span v-else>Connect With Opepen</span>
    </Button>
  </label>
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

<style scoped>
span {
  justify-content: flex-start;
  gap: var(--spacer-sm);
}
</style>
