<template>
  <Popover :open="signingIn">
    <h1>Signing In</h1>
    <p>Confirm in your wallet.</p>
  </Popover>

  <Modal :open="signInFailed" :x-close="false">
    <h1>Sign In Failed</h1>
    <p>The wallet request did not complete.</p>

    <Actions>
      <Button @click="cancel" class="secondary">Go Home</Button>
      <Button class="primary" @click="reload">Try Again</Button>
    </Actions>
  </Modal>
</template>

<script setup>
// useSignIn() already fetches the session once on first use and treats a
// 401 as "signed out". Calling fetchMe() again here fired a second request on
// every page load and surfaced its 401 as an uncaught error in the console.
useSignIn()

const reload = () => window.location.reload()
const cancel = async () => {
  navigateTo('/')
  signInFailed.value = false
}
</script>
