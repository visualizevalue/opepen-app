<template>
  <MainSideNavLink
    v-if="submission && (optInAvailable || revealing)"
    :to="`/submissions/${submission.uuid}`"
    :title="title"
    :badge="badge"
    :note="note"
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
const badge = computed(() => `live`)

/*
 * The countdown sits in its own chip beside the live one rather than on a
 * second line. While a set is revealing the title already carries its own
 * countdown, so this shows the block confirmations instead.
 */
const note = computed(() => {
  if (revealing.value) return blockConfirmations.value ? blockConfirmationText.value : ``

  return optInCountDown.str.value || ``
})
</script>
