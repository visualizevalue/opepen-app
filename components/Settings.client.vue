<template>
  <SettingsForm :address="address" />
</template>

<script setup>
import { useAccount } from '~/helpers/use-wagmi'

const route = useRoute()

const { address: myAddress } = useAccount()

const address = computed(() => route.params.id || myAddress.value)
</script>
