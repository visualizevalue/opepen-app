<template>
  <div class="submission-progress">
    <div class="progress-header">
      <div class="step-indicator">
        <span class="current">Step {{ currentStep }}</span>
        <span class="divider">/</span>
        <span class="total">{{ totalSteps }}</span>
      </div>
      <div class="completion-percent">
        {{ completionData.percent }}% Complete
      </div>
    </div>

    <Progress :percent="completionData.percent">
      <template #primary>
        <span v-if="completionData.isComplete">All required fields complete!</span>
        <span v-else-if="completionData.missing.length === 1">
          1 field remaining
        </span>
        <span v-else-if="completionData.missing.length > 1">
          {{ completionData.missing.length }} fields remaining
        </span>
      </template>
    </Progress>

    <div v-if="showMissingFields && !completionData.isComplete" class="missing-fields">
      <div class="missing-header">Missing required fields:</div>
      <ul class="missing-list">
        <li v-for="field in formattedMissingFields" :key="field">{{ field }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentStep: {
    type: Number,
    default: 1,
  },
  totalSteps: {
    type: Number,
    default: 6,
  },
  completionData: {
    type: Object,
    default: () => ({
      percent: 0,
      missing: [],
      isComplete: false,
    }),
  },
  showMissingFields: {
    type: Boolean,
    default: false,
  },
})

const fieldLabels = {
  name: 'Set Name',
  description: 'Set Description',
  images: 'Base Edition Images',
  editionNames: 'Edition Names',
  artist: 'Artist Name',
  type: 'Edition Type',
  dynamicImages: 'Dynamic Variant Images',
}

const formattedMissingFields = computed(() => {
  return props.completionData.missing.map(field => fieldLabels[field] || field)
})
</script>

<style scoped>
.submission-progress {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);
  padding: var(--spacer);
  background: var(--gray-z-1);
  border-radius: var(--border-radius);
  border: var(--border);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  @mixin ui-font;
  font-size: var(--font-sm);
  color: var(--gray-z-6);
}

.step-indicator {
  display: flex;
  align-items: baseline;
  gap: var(--spacer-xs);

  .current {
    font-size: var(--font-md);
    font-weight: 600;
    color: var(--color);
  }

  .divider {
    color: var(--muted);
  }

  .total {
    color: var(--muted);
  }
}

.completion-percent {
  font-weight: 500;
  color: var(--success);
}

.missing-fields {
  @mixin ui-font;
  font-size: var(--font-sm);
  padding-top: var(--spacer-xs);
  border-top: var(--border);
}

.missing-header {
  color: var(--muted);
  margin-bottom: var(--spacer-xs);
}

.missing-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacer-xs);

  li {
    color: var(--gray-z-6);
    padding-left: var(--spacer-sm);
    position: relative;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--warning);
    }
  }
}
</style>
