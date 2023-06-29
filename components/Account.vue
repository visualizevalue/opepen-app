<template>
  <span class="small upper" :class="{ avatar }">
    <img v-if="!hideAvatar && avatar" :src="avatar" />
    <span v-if="ens">{{ ens }}</span>
    <span v-else>{{ display }}</span>
  </span>
</template>

<script setup>
// import { useEnsName, useEnsAvatar } from '~/helpers/use-wagmi'
import { useEnsName, useEnsAvatar } from '~/helpers/use-wagmi'
import shortAddress from '~~/helpers/short-address'

const props = defineProps({
  address: String,
  hideAvatar: Boolean,
})

const ens = useEnsName(props.address)
const avatar = useEnsAvatar(ens)

const display = computed(() => {
  if (ens.value) return ens.value

  return shortAddress(props.address)
})
</script>

<style lang="postcss" scoped>
span {
  display: inline-flex;
  align-items: center;
  gap: var(--size-2);

  img {
    width: var(--size-5);
    height: var(--size-5);
    border-radius: 50%;
    align-self: center;
  }
}
</style>
