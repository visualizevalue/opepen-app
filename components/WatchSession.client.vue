<template>
  <Popover :open="signingIn">
    <h1>Signing In</h1>
    <p>Requesting "Sign In With Ethereum" confirmation...</p>
  </Popover>

  <Modal :open="signInFailed" :x-close="false">
    <h1>Sign In Failed</h1>
    <p>Request for "Sign In With Ethereum" failed...</p>
    <p>Please reload the page and try again.</p>

    <Actions>
      <Button @click="cancel" class="secondary">Go Home</Button>
      <Button @click="reload">Retry</Button>
    </Actions>
  </Modal>
</template>

<script setup>
const { fetchMe } = useSignIn()
fetchMe()

const reload = () => window.location.reload()
const cancel = async () => {
  navigateTo('/')
  signInFailed.value = false
}
</script>
