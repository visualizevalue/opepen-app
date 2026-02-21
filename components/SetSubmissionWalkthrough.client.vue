<template>
  <Modal :open="isOpen" @close="handleClose" :x-close="true" class="submission-walkthrough">
    <WalkthroughHeader
      :current-step="currentStepNumber"
      :total-steps="totalSteps"
      :completion-percent="completionMetrics.percent"
      @exit="handleClose"
    />

    <div class="walkthrough-content">
      <component
        :is="currentStepComponent"
        v-model:formData="formDataProxy"
        :validation-errors="validationErrors"
        @validate="handleValidate"
      />
    </div>

    <WalkthroughFooter
      :current-step="currentStepNumber"
      :total-steps="totalSteps"
      :can-progress="canProgress"
      :is-first-step="isFirstStep"
      :is-last-step="isLastStep"
      :is-validating="isValidating"
      @previous="handlePrevious"
      @next="handleNext"
      @skip="handleSkip"
      @complete="handleComplete"
    />
  </Modal>
</template>

<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    required: true,
  },
  startStep: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['update:open', 'complete', 'exit', 'step-change'])

// Setup walkthrough composable
const submissionData = toRef(props, 'data')
const {
  currentStep,
  getTotalSteps,
  completionMetrics,
  canProgressToStep,
  nextStep,
  previousStep,
  goToStep,
  markSubmissionComplete,
} = useSubmissionWalkthrough(submissionData)

// Initialize current step from prop
onMounted(() => {
  if (props.startStep) {
    goToStep(props.startStep)
  }
})

// Sync open state
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

// Two-way binding for form data
const formDataProxy = computed({
  get: () => props.data,
  set: (value) => {
    // Form data is updated via individual field updates in step components
    // This computed is mainly for reading
  },
})

// Step management
const currentStepNumber = computed(() => currentStep.value)
const totalSteps = computed(() => getTotalSteps.value)
const isFirstStep = computed(() => currentStepNumber.value === 1)
const isLastStep = computed(() => currentStepNumber.value === totalSteps.value)

const isDynamic = computed(() => props.data?.edition_type === 'DYNAMIC')

// Map steps to components
const stepComponents = {
  1: 'SetSubmissionWalkthroughStep1EditionType',
  2: 'SetSubmissionWalkthroughStep2SetIdentity',
  3: 'SetSubmissionWalkthroughStep3BaseImages',
  4: 'SetSubmissionWalkthroughStep4EditionNames',
  5: 'SetSubmissionWalkthroughStep5DynamicImages', // Only for dynamic sets
  6: 'SetSubmissionWalkthroughStep6ArtistInfo',
  7: 'SetSubmissionWalkthroughStep7Review',
}

const currentStepComponent = computed(() => {
  // For print sets, skip step 5 (dynamic images)
  if (!isDynamic.value && currentStepNumber.value >= 5) {
    // Adjust step mapping for print sets
    const adjustedSteps = {
      5: 'SetSubmissionWalkthroughStep6ArtistInfo',
      6: 'SetSubmissionWalkthroughStep7Review',
    }
    return adjustedSteps[currentStepNumber.value]
  }

  return stepComponents[currentStepNumber.value]
})

// Validation state
const isValidating = ref(false)
const validationErrors = ref([])
const canProgress = ref(true)

const handleValidate = async () => {
  isValidating.value = true
  validationErrors.value = []

  // Validation happens in each step component
  // They emit their validation status

  // Check if we can progress based on the composable
  canProgress.value = canProgressToStep(currentStepNumber.value + 1)

  isValidating.value = false
  return canProgress.value
}

// Navigation handlers
const handlePrevious = () => {
  previousStep()
  emit('step-change', currentStepNumber.value)
}

const handleNext = async () => {
  const valid = await handleValidate()
  if (valid) {
    nextStep()
    emit('step-change', currentStepNumber.value)
  }
}

const handleSkip = () => {
  // Close walkthrough and switch to inline mode
  isOpen.value = false
  emit('exit', 'skipped')
}

const handleComplete = async () => {
  // Mark submission as complete
  markSubmissionComplete()
  isOpen.value = false
  emit('complete', props.data)
}

const handleClose = () => {
  // Show confirmation if user has made progress
  if (currentStepNumber.value > 1 && !completionMetrics.value.isComplete) {
    const confirmed = confirm(
      'Are you sure you want to exit? Your progress has been saved and you can resume later.'
    )
    if (!confirmed) return
  }

  isOpen.value = false
  emit('exit', 'closed')
}

// Watch for step changes
watch(currentStepNumber, (newStep) => {
  handleValidate()
})
</script>

<style scoped>
.submission-walkthrough {
  :deep(.modal-content) {
    max-width: 48rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
  }
}

.walkthrough-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacer);
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
}
</style>
