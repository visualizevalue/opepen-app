<template>
  <WithAccount v-slot="{ address }">
    <WithProfile v-slot="{ account }">
      <slot v-if="isAuthenticated" :address="address" :account="account" :is-admin="isAdmin" />
    </WithProfile>
  </WithAccount>

  <Modal :open="!isAuthenticated && !signInLoading" :x-close="false" compat>
    <h1>Sign In</h1>
    <p>Sign in with your wallet to continue.</p>

    <Actions>
      <Button @click="cancel" class="secondary">Back</Button>
      <Button class="primary" @click="signIn">Sign In</Button>
    </Actions>
  </Modal>
</template>

<script setup>
const { signIn } = useSignIn()
const router = useRouter()

// Return the visitor to where they came from rather than resetting them to
// the home page; fall back to home when this page was the entry point.
const cancel = async () => {
  if (window.history.length > 1) return router.back()

  navigateTo('/')
}
</script>
