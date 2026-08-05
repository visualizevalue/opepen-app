<template>
  <MainSideNavLink
    v-if="submission && (optInAvailable || revealing)"
    :to="`/submissions/${submission.uuid}`"
    :title="title"
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
    : `${submission.value.name}`
})
/*
 * The countdown rides inside the live chip rather than a second line. While a
 * set is revealing the title already carries its own countdown, so the chip
 * falls back to the block confirmations, then to a bare "live".
 */
const badge = computed(() => {
  if (revealing.value) return blockConfirmations.value ? blockConfirmationText.value : `live`

  return optInCountDown.str.value ? `live ${optInCountDown.str.value}` : `live`
})
</script>
