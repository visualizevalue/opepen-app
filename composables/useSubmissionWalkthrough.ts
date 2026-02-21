import type { SetSubmission } from '~/utils/types'

export interface WalkthroughState {
  preference: 'wizard' | 'inline' | 'auto'
  currentStep: number
  dismissedHints: string[]
  completedFirstSubmission: boolean
}

export const useSubmissionWalkthrough = (submissionData: Ref<SetSubmission | null>) => {
  const currentStep = ref(1)
  const walkthroughActive = ref(false)

  // localStorage persistence with safe defaults
  const preference = useLocalStorage<WalkthroughState['preference']>(
    'opepen-submission-walkthrough-preference',
    'auto'
  )
  const currentStepKey = useLocalStorage<number>(
    'opepen-submission-current-step',
    1
  )
  const dismissedHints = useLocalStorage<string[]>(
    'opepen-submission-dismissed-hints',
    []
  )
  const completedFirstSubmission = useLocalStorage<boolean>(
    'opepen-submission-completed-first',
    false
  )

  // Helper functions for validation
  const hasAllImages = (data: SetSubmission | null): boolean => {
    if (!data) return false
    return !!(
      data.edition1Image &&
      data.edition4Image &&
      data.edition5Image &&
      data.edition10Image &&
      data.edition20Image &&
      data.edition40Image
    )
  }

  const hasAllEditionNames = (data: SetSubmission | null): boolean => {
    if (!data) return false
    return !!(
      data.edition1Name &&
      data.edition4Name &&
      data.edition5Name &&
      data.edition10Name &&
      data.edition20Name &&
      data.edition40Name
    )
  }

  const hasDynamicImages = (data: SetSubmission | null): boolean => {
    if (!data?.dynamicSetImages) return false
    const images = data.dynamicSetImages

    // Check edition of 4 (4 variants)
    const has4 = !!(
      images.image4_1 &&
      images.image4_2 &&
      images.image4_3 &&
      images.image4_4
    )

    // Check edition of 5 (5 variants)
    const has5 = !!(
      images.image5_1 &&
      images.image5_2 &&
      images.image5_3 &&
      images.image5_4 &&
      images.image5_5
    )

    // Check edition of 10 (10 variants)
    const has10 = !!(
      images.image10_1 &&
      images.image10_2 &&
      images.image10_3 &&
      images.image10_4 &&
      images.image10_5 &&
      images.image10_6 &&
      images.image10_7 &&
      images.image10_8 &&
      images.image10_9 &&
      images.image10_10
    )

    // Check edition of 20 (20 variants)
    const has20 = !!(
      images.image20_1 &&
      images.image20_2 &&
      images.image20_3 &&
      images.image20_4 &&
      images.image20_5 &&
      images.image20_6 &&
      images.image20_7 &&
      images.image20_8 &&
      images.image20_9 &&
      images.image20_10 &&
      images.image20_11 &&
      images.image20_12 &&
      images.image20_13 &&
      images.image20_14 &&
      images.image20_15 &&
      images.image20_16 &&
      images.image20_17 &&
      images.image20_18 &&
      images.image20_19 &&
      images.image20_20
    )

    // Check edition of 40 (40 variants)
    const has40 = !!(
      images.image40_1 &&
      images.image40_2 &&
      images.image40_3 &&
      images.image40_4 &&
      images.image40_5 &&
      images.image40_6 &&
      images.image40_7 &&
      images.image40_8 &&
      images.image40_9 &&
      images.image40_10 &&
      images.image40_11 &&
      images.image40_12 &&
      images.image40_13 &&
      images.image40_14 &&
      images.image40_15 &&
      images.image40_16 &&
      images.image40_17 &&
      images.image40_18 &&
      images.image40_19 &&
      images.image40_20 &&
      images.image40_21 &&
      images.image40_22 &&
      images.image40_23 &&
      images.image40_24 &&
      images.image40_25 &&
      images.image40_26 &&
      images.image40_27 &&
      images.image40_28 &&
      images.image40_29 &&
      images.image40_30 &&
      images.image40_31 &&
      images.image40_32 &&
      images.image40_33 &&
      images.image40_34 &&
      images.image40_35 &&
      images.image40_36 &&
      images.image40_37 &&
      images.image40_38 &&
      images.image40_39 &&
      images.image40_40
    )

    return has4 && has5 && has10 && has20 && has40
  }

  // Calculate completion metrics
  const completionMetrics = computed(() => {
    const data = submissionData.value

    const required = {
      name: !!(data?.name && data.name.length >= 3),
      description: !!(data?.description && data.description.length >= 10),
      images: hasAllImages(data),
      editionNames: hasAllEditionNames(data),
      artist: !!data?.artist,
      type: !!data?.edition_type,
    }

    // Add dynamic images requirement if type is DYNAMIC
    if (data?.edition_type === 'DYNAMIC') {
      required['dynamicImages'] = hasDynamicImages(data)
    }

    const requiredCount = Object.values(required).filter(Boolean).length
    const requiredTotal = Object.keys(required).length

    return {
      percent: requiredTotal > 0 ? Math.round((requiredCount / requiredTotal) * 100) : 0,
      missing: Object.keys(required).filter(k => !required[k]),
      isComplete: requiredCount === requiredTotal,
      requiredFields: required,
    }
  })

  // Step validation - determines if user can progress to next step
  const stepValidation = computed(() => {
    const data = submissionData.value
    const isDynamic = data?.edition_type === 'DYNAMIC'

    return {
      1: () => !!data?.edition_type,
      2: () => !!(data?.name && data.name.length >= 3 && data?.description && data.description.length >= 10),
      3: () => hasAllImages(data),
      4: () => hasAllEditionNames(data),
      5: () => isDynamic ? hasDynamicImages(data) : true,
      6: () => !!data?.artist,
      7: () => completionMetrics.value.isComplete,
    }
  })

  const canProgressToStep = (step: number): boolean => {
    // Can always go backwards
    if (step <= currentStep.value) return true

    // Check all previous steps are valid
    for (let i = 1; i < step; i++) {
      const validator = stepValidation.value[i]
      if (validator && !validator()) {
        return false
      }
    }

    return true
  }

  const getTotalSteps = computed(() => {
    const isDynamic = submissionData.value?.edition_type === 'DYNAMIC'
    // Dynamic sets have an extra step for dynamic images
    return isDynamic ? 7 : 6
  })

  const startWalkthrough = (startStep: number = 1) => {
    currentStep.value = startStep
    walkthroughActive.value = true
  }

  const exitWalkthrough = () => {
    walkthroughActive.value = false
    currentStepKey.value = currentStep.value // Save for resume
  }

  const goToStep = (step: number) => {
    if (canProgressToStep(step)) {
      currentStep.value = step
      currentStepKey.value = step
    }
  }

  const nextStep = () => {
    const validator = stepValidation.value[currentStep.value]
    if (validator && validator()) {
      const maxSteps = getTotalSteps.value
      if (currentStep.value < maxSteps) {
        goToStep(currentStep.value + 1)
      }
    }
  }

  const previousStep = () => {
    if (currentStep.value > 1) {
      goToStep(currentStep.value - 1)
    }
  }

  const dismissHint = (hintId: string) => {
    if (!dismissedHints.value.includes(hintId)) {
      dismissedHints.value = [...dismissedHints.value, hintId]
    }
  }

  const isHintDismissed = (hintId: string): boolean => {
    return dismissedHints.value.includes(hintId)
  }

  const markSubmissionComplete = () => {
    completedFirstSubmission.value = true
  }

  // Determine if we should show wizard for first-time users
  const shouldShowWelcome = computed(() => {
    return preference.value === 'auto' && !completedFirstSubmission.value
  })

  // Check if submission can be resumed
  const canResume = computed(() => {
    const data = submissionData.value
    return !!(
      data &&
      !data.published_at &&
      currentStepKey.value > 1 &&
      !completionMetrics.value.isComplete
    )
  })

  return {
    // State
    currentStep,
    walkthroughActive,
    preference,
    dismissedHints,
    completedFirstSubmission,

    // Computed
    completionMetrics,
    getTotalSteps,
    canProgressToStep,
    shouldShowWelcome,
    canResume,

    // Methods
    startWalkthrough,
    exitWalkthrough,
    goToStep,
    nextStep,
    previousStep,
    dismissHint,
    isHintDismissed,
    markSubmissionComplete,

    // Helpers (exposed for reuse in components)
    hasAllImages,
    hasAllEditionNames,
    hasDynamicImages,
  }
}
