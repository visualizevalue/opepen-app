<template>
  <WithAccount v-slot="{ address }">
    <WithProfile v-slot="{ account }">
      <slot v-if="isAuthenticated" :address="address" :account="account" :is-admin="isAdmin" />
    </WithProfile>
  </WithAccount>

  <Modal :open="!isAuthenticated && !signInLoading" :x-close="false" compat>
    <h1>Sign In Required</h1>
    <p>You have to sign in with Ethereum to view this page.</p>

    <Actions>
      <Button @click="cancel" class="secondary">Back</Button>
      <Button @click="signIn">Sign In</Button>
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
