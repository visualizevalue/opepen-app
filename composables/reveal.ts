export const useReveal = async (currentBlock: Ref<bigint>) => {
  const {
    submission,
    reloadStagedSubmission,

    optInAvailable,
    optInUntil,
    secondsUntilOptInClose,
    optInCountDown,
  } = await useStagedOptIn()

  const now = useNow()
  const revealsAt = computed(() => DateTime.fromISO(submission.value?.reveals_at))
  const secondsUntilReveal = computed(() => revealsAt.value?.toUnixInteger() - now.value)
  const revealCountDown = useCountDown(secondsUntilReveal)
  const revealed = computed(() => !! submission.value?.set_id)
  const revealing = computed(() => revealsAt.value && secondsUntilReveal.value < 0 && ! revealed.value)
  const blockConfirmations = computed(() =>
    currentBlock.value &&
    submission.value.reveal_block_number &&
    currentBlock.value - BigInt(submission.value?.reveal_block_number)
  )
  const blockConfirmationText = computed(() => {
    try {
      const b = blockConfirmations.value
      if (b === false || b === null) return ``

      if (b >= 0n) {
        return `${b} confimation${b === 0n || b > 1n ? `s` : ``}`
      }

      return `${b * -1n} block${b === 0n || b < -1n ? `s` : ``}`
    } catch (e) {
      return ``
    }
  })
  watch(blockConfirmations, () => {
    // FIXME: This doesn't compute right
    if (revealed.value) return
    if (blockConfirmations.value < 4n) return
    reloadStagedSubmission()
  })

  return {
    revealsAt,
    secondsUntilReveal,
    revealing,
    revealCountDown,

    blockConfirmations,
    blockConfirmationText,
    revealed,
  }
}

