<template>
  <div class="submission-entry-point">
    <!-- Welcome Modal for First-Time Users -->
    <Modal :open="showWelcomeModal" @close="handleWelcomeDismiss" class="welcome-modal">
      <div class="welcome-content">
        <Icon type="sparkles" class="welcome-icon" />
        <h2>Welcome to Opepen Set Creation!</h2>
        <p class="welcome-lead">
          Creating your first set? We'll guide you through every step with our interactive
          walkthrough.
        </p>

        <div class="welcome-options">
          <div class="option-card recommended">
            <div class="option-header">
              <Icon type="compass" />
              <span class="badge">Recommended</span>
            </div>
            <h4>Guided Walkthrough</h4>
            <p>
              Step-by-step guidance with explanations, examples, and tips. Perfect for first-time
              creators.
            </p>
            <Button @click="startWalkthrough" class="full-width">
              <Icon type="play-circle" />
              <span>Start Guided Mode</span>
            </Button>
          </div>

          <div class="option-card">
            <div class="option-header">
              <Icon type="zap" />
            </div>
            <h4>Advanced Form</h4>
            <p>Direct access to all fields at once. Best for experienced users who know the ropes.</p>
            <Button @click="useAdvancedForm" class="secondary full-width">
              <span>Use Advanced Form</span>
            </Button>
          </div>
        </div>

        <label class="remember-choice">
          <input type="checkbox" v-model="rememberChoice" />
          <span>Remember my choice for next time</span>
        </label>
      </div>
    </Modal>

    <!-- Resume Banner for Incomplete Submissions -->
    <Alert v-if="canResume && !showWelcomeModal && !walkthroughActive" class="resume-banner">
      <div class="resume-content">
        <div class="resume-info">
          <Icon type="clock" />
          <div>
            <strong>Continue where you left off?</strong>
            <p>
              You're {{ completionMetrics.percent }}% complete (Step {{ currentStepKey }} of
              {{ getTotalSteps }})
            </p>
          </div>
        </div>
        <Actions>
          <Button @click="resumeWalkthrough" class="small">
            <Icon type="play" />
            <span>Resume Walkthrough</span>
          </Button>
          <Button @click="dismissResume" class="secondary small">Dismiss</Button>
        </Actions>
      </div>
    </Alert>

    <!-- Wizard Modal -->
    <SetSubmissionWalkthrough
      v-model:open="walkthroughActive"
      :data="submissionData"
      :start-step="currentStepKey"
      @complete="handleWalkthroughComplete"
      @exit="handleWalkthroughExit"
      @step-change="handleStepChange"
    />

    <!-- Inline Form (Default View) -->
    <SetSubmissionInline
      v-if="!walkthroughActive && viewMode === 'inline'"
      :data="submissionData"
      @update:data="handleDataUpdate"
      @switch-to-wizard="switchToWizard"
      :disabled="isDisabled"
    />

    <!-- Original Form (Fallback) -->
    <SetSubmissionForm
      v-if="!walkthroughActive && viewMode === 'original'"
      :data="submissionData"
      :refresh="refresh"
      @updated="handleDataUpdate"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  submissionData: {
    type: Object,
    required: true,
  },
  refresh: {
    type: Function,
    default: () => {},
  },
})

const emit = defineEmits(['updated'])

const submissionDataRef = toRef(props, 'submissionData')

// Setup walkthrough composable
const {
  walkthroughActive,
  preference,
  completionMetrics,
  getTotalSteps,
  shouldShowWelcome,
  canResume,
  currentStep,
  startWalkthrough: startWalkthroughFn,
  exitWalkthrough,
  markSubmissionComplete,
} = useSubmissionWalkthrough(submissionDataRef)

const currentStepKey = useLocalStorage('opepen-submission-current-step', 1)
const dismissedResume = ref(false)

// View mode: 'wizard', 'inline', 'original'
const viewMode = ref('inline')

// Welcome modal state
const showWelcomeModal = ref(false)
const rememberChoice = ref(false)

// Check if we should show welcome on mount
onMounted(() => {
  if (shouldShowWelcome.value && !props.submissionData.published_at) {
    showWelcomeModal.value = true
  } else if (preference.value === 'wizard' && !props.submissionData.published_at) {
    // User previously chose wizard, start it automatically
    walkthroughActive.value = true
  } else {
    // Default to inline view
    viewMode.value = 'inline'
  }
})

const isDisabled = computed(() => {
  return !!(
    props.submissionData.set_id ||
    (!isAdmin.value && props.submissionData.published_at)
  )
})

// Welcome modal handlers
const handleWelcomeDismiss = () => {
  showWelcomeModal.value = false
  if (rememberChoice.value) {
    preference.value = 'inline'
  }
}

const startWalkthrough = () => {
  showWelcomeModal.value = false
  if (rememberChoice.value) {
    preference.value = 'wizard'
  }
  startWalkthroughFn(1)
  walkthroughActive.value = true
}

const useAdvancedForm = () => {
  showWelcomeModal.value = false
  if (rememberChoice.value) {
    preference.value = 'inline'
  }
  viewMode.value = 'inline'
}

// Resume handlers
const resumeWalkthrough = () => {
  dismissedResume.value = false
  startWalkthroughFn(currentStepKey.value)
  walkthroughActive.value = true
}

const dismissResume = () => {
  dismissedResume.value = true
}

// Switch between modes
const switchToWizard = () => {
  walkthroughActive.value = true
}

// Walkthrough event handlers
const handleWalkthroughComplete = (data) => {
  markSubmissionComplete()
  viewMode.value = 'inline'
  emit('updated', data)
}

const handleWalkthroughExit = (reason) => {
  // Save current step for resume
  currentStepKey.value = currentStep.value
}

const handleStepChange = (step) => {
  currentStepKey.value = step
}

// Data update handler
const handleDataUpdate = (updatedData) => {
  emit('updated', updatedData)
}
</script>

<style scoped>
.submission-entry-point {
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
}

.welcome-modal {
  :deep(.modal-content) {
    max-width: 48rem;
  }
}

.welcome-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacer);
  padding: var(--spacer-lg);
  text-align: center;
}

.welcome-icon {
  width: var(--size-10);
  height: var(--size-10);
  color: var(--success);
}

.welcome-content h2 {
  @mixin h2;
  margin: 0;
}

.welcome-lead {
  color: var(--gray-z-6);
  font-size: var(--font-md);
  max-width: 36rem;
  margin: 0;
}

.welcome-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: var(--spacer);
  width: 100%;
  margin-top: var(--spacer);
}

.option-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);
  padding: var(--spacer);
  border: var(--border);
  border-radius: var(--border-radius);
  background: var(--gray-z-0);
  transition: all var(--speed);

  &:hover {
    border-color: var(--gray-z-4);
    box-shadow: var(--shadow);
  }

  &.recommended {
    border-color: var(--success);
    background: var(--success-bg, rgba(var(--success-rgb), 0.05));
  }

  h4 {
    @mixin h4;
    margin: 0;
  }

  p {
    color: var(--gray-z-6);
    font-size: var(--font-sm);
    margin: 0;
    flex: 1;
  }
}

.option-header {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);

  :deep(svg) {
    width: var(--size-5);
    height: var(--size-5);
    color: var(--success);
  }

  .badge {
    @mixin ui-font;
    font-size: var(--font-xs);
    color: var(--success);
    background: var(--success-bg, rgba(var(--success-rgb), 0.2));
    padding: var(--spacer-xs) var(--spacer-sm);
    border-radius: var(--border-radius);
    margin-left: auto;
  }
}

.full-width {
  width: 100%;
}

.remember-choice {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
  @mixin ui-font;
  font-size: var(--font-sm);
  color: var(--muted);
  cursor: pointer;

  input[type='checkbox'] {
    cursor: pointer;
  }
}

.resume-banner {
  background: var(--blue-bg, rgba(59, 130, 246, 0.1));
  border-color: var(--blue, #3b82f6);
}

.resume-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacer);
  flex-wrap: wrap;
}

.resume-info {
  display: flex;
  align-items: center;
  gap: var(--spacer);

  :deep(svg) {
    width: var(--size-6);
    height: var(--size-6);
    color: var(--blue, #3b82f6);
    flex-shrink: 0;
  }

  strong {
    display: block;
    color: var(--color);
    margin-bottom: var(--spacer-xs);
  }

  p {
    @mixin ui-font;
    font-size: var(--font-sm);
    color: var(--muted);
    margin: 0;
  }
}
</style>
