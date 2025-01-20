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

  <Modal :open="! isAuthenticated && ! signInLoading" :x-close="false">
    <h1>Sign In Required</h1>
    <p>You have to sign in with Ethereum to view this page.</p>

    <Actions>
      <Button :to="'/'" class="secondary">Go Home</Button>
      <Button @click="signIn">Sign In</Button>
    </Actions>
  </Modal>
</template>

<script setup>
const { signIn } = useSignIn()

onMounted(async () => {
  if (! isAuthenticated.value) await signIn()
})
</script>

