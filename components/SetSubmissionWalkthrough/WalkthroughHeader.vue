<template>
  <div class="walkthrough-header">
    <div class="header-content">
      <div class="title-section">
        <h2>Create Your Opepen Set</h2>
        <div class="step-counter">
          Step {{ currentStep }} of {{ totalSteps }}
        </div>
      </div>

      <button
        type="button"
        @click="$emit('exit')"
        class="exit-button"
        aria-label="Exit walkthrough"
      >
        <Icon type="x" />
      </button>
    </div>

    <div class="progress-section">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>
      <div class="progress-label">
        {{ completionPercent }}% complete
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
  totalSteps: {
    type: Number,
    required: true,
  },
  completionPercent: {
    type: Number,
    default: 0,
  },
})

defineEmits(['exit'])

const progressPercent = computed(() => {
  return Math.round((props.currentStep / props.totalSteps) * 100)
})
</script>

<style scoped>
.walkthrough-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
  padding: var(--spacer);
  border-bottom: var(--border);
  background: var(--gray-z-1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacer);
}

.title-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacer-xs);
}

h2 {
  @mixin h2;
  margin: 0;
  color: var(--color);
}

.step-counter {
  @mixin ui-font;
  font-size: var(--font-sm);
  color: var(--muted);
}

.exit-button {
  @mixin button-reset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size-8);
  height: var(--size-8);
  border-radius: var(--border-radius);
  color: var(--muted);
  transition: all var(--speed);
  cursor: pointer;

  &:hover {
    background: var(--gray-z-2);
    color: var(--color);
  }

  :deep(svg) {
    width: var(--size-5);
    height: var(--size-5);
  }
}

.progress-section {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
}

.progress-bar {
  flex: 1;
  height: var(--size-1);
  background: var(--gray-z-2);
  border-radius: var(--size-1);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--success);
  transition: width var(--speed);
  border-radius: var(--size-1);
}

.progress-label {
  @mixin ui-font;
  font-size: var(--font-sm);
  color: var(--gray-z-6);
  white-space: nowrap;
  min-width: 5rem;
  text-align: right;
}
</style>
