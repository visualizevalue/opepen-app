<template>
  <div class="walkthrough-footer">
    <div class="footer-actions">
      <Button
        v-if="!isFirstStep"
        @click="$emit('previous')"
        class="secondary"
        type="button"
      >
        <Icon type="arrow-left" />
        <span>Back</span>
      </Button>

      <Button
        v-if="isFirstStep"
        @click="$emit('skip')"
        class="secondary"
        type="button"
      >
        <span>Skip to Advanced Form</span>
      </Button>

      <div class="spacer"></div>

      <Button
        v-if="!isLastStep"
        @click="$emit('next')"
        :disabled="!canProgress || isValidating"
        type="button"
      >
        <span>{{ isValidating ? 'Validating...' : 'Continue' }}</span>
        <Icon type="arrow-right" />
      </Button>

      <Button
        v-if="isLastStep"
        @click="$emit('complete')"
        :disabled="!canProgress || isValidating"
        type="button"
      >
        <Icon type="check" />
        <span>{{ isValidating ? 'Validating...' : 'Complete Walkthrough' }}</span>
      </Button>
    </div>

    <div v-if="!canProgress" class="validation-message">
      <Icon type="alert-circle" />
      <span>Please complete all required fields before continuing</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
  totalSteps: {
    type: Number,
    required: true,
  },
  canProgress: {
    type: Boolean,
    default: true,
  },
  isFirstStep: {
    type: Boolean,
    default: false,
  },
  isLastStep: {
    type: Boolean,
    default: false,
  },
  isValidating: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['previous', 'next', 'skip', 'complete'])
</script>

<style scoped>
.walkthrough-footer {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);
  padding: var(--spacer);
  border-top: var(--border);
  background: var(--gray-z-1);
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
}

.spacer {
  flex: 1;
}

.button {
  display: flex;
  align-items: center;
  gap: var(--spacer-xs);
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :deep(svg) {
    width: var(--size-4);
    height: var(--size-4);
  }
}

.validation-message {
  @mixin ui-font;
  font-size: var(--font-sm);
  color: var(--warning);
  display: flex;
  align-items: center;
  gap: var(--spacer-xs);
  padding: var(--spacer-sm);
  background: var(--warning-bg, rgba(var(--warning-rgb), 0.1));
  border-radius: var(--border-radius);

  :deep(svg) {
    width: var(--size-4);
    height: var(--size-4);
    flex-shrink: 0;
  }
}
</style>
