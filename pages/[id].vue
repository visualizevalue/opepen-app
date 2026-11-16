<template>
  <div>
    <NuxtPage :account="account" />
  </div>
</template>

<script setup>
import { zeroAddress } from 'viem'

const route = useRoute()
const { data: account } = await useApi(`/accounts/${route.params.id}`, {
  onResponseError(err) {
    console.log('responsenerr', err)
  },
})

// This route catches every unknown single-segment path, so a mistyped link
// lands here too. Say "page", not "user": most visitors were not looking for one.
if (account.value.address === zeroAddress) {
  throw createError({
    statusCode: 404,
    statusMessage: `Page not found: /${route.params.id}`,
  })
}
</script>
