export const useReveal = async (currentBlock: Ref<BigInt>) => {
  const {
    submission,
    reloadStagedSubmission,

    optInAvailable,
    optInUntil,
    secondsUntilOptInClose,
    optInCountDown,
  } = await useOptIn()

  const revealsAt = computed(() => DateTime.fromISO(submission.value?.reveals_at))
  const secondsUntilReveal = computed(() => revealsAt.value?.toUnixInteger() - now.value)
  const revealing = computed(() => submission.value?.revealsAt && secondsUntilReveal.value > 0)
  const revealCountDown = useCountDown(secondsUntilReveal)
  const blockConfirmations = computed(() =>
    currentBlock.value &&
    submission.value.reveal_block_number &&
    currentBlock.value - BigInt(props.data.reveal_block_number)
  )
  const blockConfirmationText = computed(() => {
    const b = blockConfirmations.value
    if (b === false) return ``

    if (b >= 0n) {
      return `${b} confimation${b === 0n || b > 1n ? `s` : ``}`
    }

    return `${b * -1n} block${b === 0n || b < -1n ? `s` : ``}`
  })
  const revealed = computed(() => !! submission.value?.set_id)
  watch(revealing, () => {
    if (revealing.value) return
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

