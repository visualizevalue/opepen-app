<template>
  <section v-if="optInAvailable">
    <MainSideNavLink
      :to="`/submissions/${submission.uuid}`"
      :title="title"
      :subline="subline"
      class="success"
    />
  </section>
</template>

<script setup>
import { useBlockNumber } from '@wagmi/vue'

const {
  submission,
  optInAvailable,
  optInCountDown,
} = await useStagedSet()

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
    : `Live Opt-In (${optInCountDown.str.value}`
})
const subline = computed(() => {
  return blockConfirmations.value
    ? blockConfirmationText.value
    : submission.value.name
})
</script>

