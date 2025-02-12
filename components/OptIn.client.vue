<template>
  <section v-if="isStagedSet && optInAvailable">
    <pre>{{ optInCountDown }}</pre>
  </section>
</template>

<script setup>
import { useBlockNumber } from '@wagmi/vue'

const props = defineProps({
  submission: Object,
})

const {
  submission: stagedSubmission,
  optInAvailable,
  optInCountDown,
} = await useOptIn()

const isStagedSet = computed(() =>
  stagedSubmission.value && props.submission.uuid === stagedSubmission.value.uuid
)

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
    : stagedSubmission.value.name
})
</script>

