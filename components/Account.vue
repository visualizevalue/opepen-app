<template>
  <span class="small upper" :class="{ avatar }">
    <img v-if="!hideAvatar && avatar" :src="avatar" />
    <span v-if="ens">{{ ens }}</span>
    <span v-else>{{ display }}</span>
  </span>
</template>

<script setup>
import { useEnsName, useEnsAvatar } from 'vagmi'
import { computed } from 'vue';
import shortAddress from '~~/helpers/short-address'

const props = defineProps({
  address: String,
  hideAvatar: Boolean,
})

const { data: ens } = useEnsName({ address: props.address })
const { data: avatar } = useEnsAvatar({ addressOrName: props.address })

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

  &.avatar {
    /* span {
      display: none;

      @media (--md) {
        display: inline-block;
      }
    } */
  }
}
</style>
