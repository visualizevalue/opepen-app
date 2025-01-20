<template>
  <WithAccount v-slot="{ address }">
    <WithProfile :address="address" v-slot="{ account }">
      <slot
        :address="address"
        :account="account"
        :is-admin="isAdmin"
      />
    </WithProfile>
  </WithAccount>
</template>

<script setup>
const { signIn } = useSignIn()

onMounted(async () => {
  if (! isAuthenticated.value) await signIn()
})
</script>
