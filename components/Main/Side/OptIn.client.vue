<template>
  <MainSideNavLink
    v-if="submission && (optInAvailable || revealing)"
    :to="`/submissions/${submission.uuid}`"
    :title="title"
    :subline="subline"
    class="success"
  />
</template>

<script setup>
import { useBlockNumber } from '@wagmi/vue'

const {
  submission,
  optInAvailable,
  optInCountDown,
} = await useStagedOptIn()

const { data: currentBlock } = useBlockNumber({ chainId: 1 })
const {
  revealing,
  revealsAt,
  secondsUntilReveal,
  revealCountDown,
  blockConfirmations,
  blockConfirmationText,
  revealed,
} = await useReveal(currentBlock)

const title = computed(() => {
  return revealing.value
    ? `Set Reveal Pending ${secondsUntilReveal.value > 0 ? `(${revealCountDown.str.value})` : ``}`
    : `Live Consensus (${optInCountDown.str.value})`
})
const subline = computed(() => {
  return blockConfirmations.value
    ? blockConfirmationText.value
    : submission.value.name
})
</script>

