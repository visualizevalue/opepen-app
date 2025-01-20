<template>
  <WithAccount v-slot="{ address }">
    <WithProfile :address="address" v-slot="{ account }">
      <slot
        :address="address"
        :account="account"
        :is-admin="isAdmin"
      />
    </WithProfile>

    <Popover :open="signingIn">
      <h1>Signing In</h1>
      <p>Requesting "Sign In With Ethereum" confirmation...</p>
    </Popover>

    <Modal :open="signInFailed" :x-close="false">
      <h1>Sign In Failed</h1>
      <p>Request for "Sign In With Ethereum" failed...</p>
      <p>Please reload the page and try again.</p>

      <Actions>
        <Button :to="'/'" class="secondary">Go Home</Button>
        <Button @click="reload">Retry</Button>
      </Actions>
    </Modal>
  </WithAccount>
</template>

<script setup>
const { signIn } = useSignIn()

const reload = () => window.location.reload()

onMounted(async () => {
  if (! isAuthenticated.value) await signIn()
})
</script>
