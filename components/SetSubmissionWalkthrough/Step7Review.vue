<template>
  <div class="step-review">
    <div class="step-header">
      <h3>Review Your Submission</h3>
      <p class="lead">
        Take a moment to review everything before completing your submission.
      </p>
    </div>

    <div v-if="!completionData.isComplete" class="incomplete-warning">
      <Alert class="warning">
        <p>
          <strong>Some required fields are still missing:</strong>
        </p>
        <ul>
          <li v-for="field in missingFields" :key="field">{{ field }}</li>
        </ul>
        <p>Please go back and complete these fields before publishing.</p>
      </Alert>
    </div>

    <div class="review-sections">
      <div class="review-section">
        <h4>Set Information</h4>
        <div class="review-items">
          <div class="review-item">
            <span class="item-label">Name:</span>
            <span class="item-value">{{ formData.name || '—' }}</span>
          </div>
          <div class="review-item">
            <span class="item-label">Description:</span>
            <span class="item-value">{{ formData.description || '—' }}</span>
          </div>
          <div class="review-item">
            <span class="item-label">Edition Type:</span>
            <span class="item-value">{{ editionTypeLabel }}</span>
          </div>
          <div class="review-item">
            <span class="item-label">Artist:</span>
            <span class="item-value">{{ formData.artist || '—' }}</span>
          </div>
        </div>
      </div>

      <div class="review-section">
        <h4>Edition Names</h4>
        <div class="review-items">
          <div class="review-item">
            <span class="item-label">1/1:</span>
            <span class="item-value">{{ formData.edition1Name || '—' }}</span>
          </div>
          <div class="review-item">
            <span class="item-label">1/4:</span>
            <span class="item-value">{{ formData.edition4Name || '—' }}</span>
          </div>
          <div class="review-item">
            <span class="item-label">1/5:</span>
            <span class="item-value">{{ formData.edition5Name || '—' }}</span>
          </div>
          <div class="review-item">
            <span class="item-label">1/10:</span>
            <span class="item-value">{{ formData.edition10Name || '—' }}</span>
          </div>
          <div class="review-item">
            <span class="item-label">1/20:</span>
            <span class="item-value">{{ formData.edition20Name || '—' }}</span>
          </div>
          <div class="review-item">
            <span class="item-label">1/40:</span>
            <span class="item-value">{{ formData.edition40Name || '—' }}</span>
          </div>
        </div>
      </div>

      <div class="review-section">
        <h4>Preview Images</h4>
        <div class="preview-images">
          <div v-if="formData.edition1Image" class="preview-item featured">
            <Image :image="formData.edition1Image" />
            <span class="preview-label">1/1</span>
          </div>
          <div v-if="formData.edition4Image" class="preview-item">
            <Image :image="formData.edition4Image" />
            <span class="preview-label">1/4</span>
          </div>
          <div v-if="formData.edition5Image" class="preview-item">
            <Image :image="formData.edition5Image" />
            <span class="preview-label">1/5</span>
          </div>
          <div v-if="formData.edition10Image" class="preview-item">
            <Image :image="formData.edition10Image" />
            <span class="preview-label">1/10</span>
          </div>
          <div v-if="formData.edition20Image" class="preview-item">
            <Image :image="formData.edition20Image" />
            <span class="preview-label">1/20</span>
          </div>
          <div v-if="formData.edition40Image" class="preview-item">
            <Image :image="formData.edition40Image" />
            <span class="preview-label">1/40</span>
          </div>
        </div>
      </div>

      <div v-if="formData.edition_type === 'DYNAMIC'" class="review-section">
        <h4>Dynamic Variants</h4>
        <div class="review-item">
          <span class="item-label">Total variants uploaded:</span>
          <span class="item-value">{{ dynamicVariantsCount }} / 80</span>
        </div>
      </div>

      <div v-if="formData.coCreators && formData.coCreators.length > 0" class="review-section">
        <h4>Co-Creators</h4>
        <div class="review-items">
          <div v-for="(address, index) in formData.coCreators" :key="address" class="review-item">
            <span class="item-label">Co-Creator {{ index + 1 }}:</span>
            <span class="item-value mono">{{ address }}</span>
          </div>
        </div>
      </div>
    </div>

    <Alert v-if="completionData.isComplete" class="success">
      <p>
        <strong>All set!</strong> Your submission is complete and ready. Click "Complete
        Walkthrough" below to finish. Your submission will be saved as a draft and you can publish
        it later.
      </p>
    </Alert>
  </div>
</template>

<script setup>
const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  validationErrors: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:formData', 'validate'])

// Use the walkthrough composable to get completion data
const submissionData = toRef(props, 'formData')
const { completionMetrics } = useSubmissionWalkthrough(submissionData)

const completionData = completionMetrics

const editionTypeLabel = computed(() => {
  const type = props.formData.edition_type
  return type === 'DYNAMIC' ? 'Dynamic' : type === 'NUMBERED_PRINT' ? 'Numbered Print' : 'Print'
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

const missingFields = computed(() => {
  return completionData.value.missing.map(field => fieldLabels[field] || field)
})

const dynamicVariantsCount = computed(() => {
  if (!props.formData.dynamicSetImages) return 0

  const images = props.formData.dynamicSetImages
  let count = 0

  // Count all dynamic images (4 + 5 + 10 + 20 + 40 = 79)
  for (let i = 1; i <= 4; i++) if (images[`image4_${i}`]) count++
  for (let i = 1; i <= 5; i++) if (images[`image5_${i}`]) count++
  for (let i = 1; i <= 10; i++) if (images[`image10_${i}`]) count++
  for (let i = 1; i <= 20; i++) if (images[`image20_${i}`]) count++
  for (let i = 1; i <= 40; i++) if (images[`image40_${i}`]) count++

  return count
})

// Validate on mount
onMounted(() => {
  emit('validate')
})
</script>

<style scoped>
.step-review {
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
}

.step-header {
  h3 {
    @mixin h3;
    margin: 0 0 var(--spacer-sm) 0;
  }

  .lead {
    color: var(--gray-z-6);
    margin: 0;
  }
}

.incomplete-warning {
  margin-bottom: var(--spacer);
}

.warning {
  background: var(--warning-bg, rgba(var(--warning-rgb), 0.1));
  border-color: var(--warning);

  strong {
    color: var(--color);
  }

  ul {
    margin: var(--spacer-sm) 0;
    padding-left: var(--spacer);
  }
}

.success {
  background: var(--success-bg, rgba(var(--success-rgb), 0.1));
  border-color: var(--success);

  strong {
    color: var(--color);
  }
}

.review-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-lg);
}

.review-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
  padding: var(--spacer);
  background: var(--gray-z-1);
  border-radius: var(--border-radius);
  border: var(--border);

  h4 {
    @mixin h4;
    margin: 0;
    padding-bottom: var(--spacer-sm);
    border-bottom: var(--border);
  }
}

.review-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);
}

.review-item {
  display: flex;
  gap: var(--spacer);
  @mixin ui-font;
  font-size: var(--font-sm);

  @media (max-width: 36rem) {
    flex-direction: column;
    gap: var(--spacer-xs);
  }
}

.item-label {
  color: var(--muted);
  min-width: 8rem;
  flex-shrink: 0;
}

.item-value {
  color: var(--color);
  flex: 1;

  &.mono {
    font-family: monospace;
    font-size: var(--font-xs);
    word-break: break-all;
  }
}

.preview-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: var(--spacer);
}

.preview-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-xs);

  &.featured {
    grid-column: span 2;
  }

  :deep(.image) {
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--border-radius);
  }
}

.preview-label {
  @mixin ui-font;
  font-size: var(--font-sm);
  color: var(--muted);
  text-align: center;
}
</style>
