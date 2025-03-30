<template>
  <MainSideNavLink
    v-if="submission && (optInAvailable || revealing)"
    :to="`/submissions/${submission.uuid}`"
    :title="title"
    :subline="subline"
    :badge="badge"
  />
</template>

<script setup>
import { useBlockNumber } from '@wagmi/vue'

const { submission, optInAvailable, optInCountDown } = await useStagedOptIn()

const { data: currentBlock } = useBlockNumber({ chainId: 1 })
const {
  revealing,
  secondsUntilReveal,
  revealCountDown,
  blockConfirmations,
  blockConfirmationText,
} = await useReveal(currentBlock)

const title = computed(() => {
  return revealing.value
    ? `Set Reveal Pending ${secondsUntilReveal.value > 0 ? `(${revealCountDown.str.value})` : ``}`
    : `${submission.value.name} (${optInCountDown.str.value})`
})
const badge = computed(() => `live`)
const subline = computed(() => {
  return blockConfirmations.value ? blockConfirmationText.value : `Live Consensus`
})
</script>
