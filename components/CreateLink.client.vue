<template>
  <Button v-if="isConnected" to="/create" @click="onCreateClick" class="create">
    <Icon type="plus" />
    <span>Create</span>
  </Button>
</template>

<script setup>
import { useAccount } from '~/helpers/use-wagmi'

const { isConnected } = useAccount()
</script>
