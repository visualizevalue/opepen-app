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

if (account.value.address === zeroAddress) {
  throw createError({
    statusCode: 404,
    statusMessage: 'User Not Found',
  })
}
</script>
