<template>
  <div class="step-dynamic-images">
    <div class="step-header">
      <h3>Upload Dynamic Variants</h3>
      <p class="lead">
        Create unique visual variants for each Opepen in each edition. This is what makes dynamic
        sets special!
      </p>
    </div>

    <Alert class="warning">
      <p>
        <strong>Important:</strong> You'll need to upload a total of 80 images (6 base + 74
        variants). Each variant should be unique but follow the opepen schematic for that edition
        size.
      </p>
    </Alert>

    <div class="upload-sections">
      <div class="upload-section">
        <div class="section-header">
          <h4>Edition of 4 Variants</h4>
          <p>Upload 4 unique variants</p>
        </div>
        <DynamicImagesForm
          :set-submission-id="formData.uuid"
          :dynamic-set-images="formData.dynamicSetImages || {}"
          @updated="handleDynamicImagesUpdate"
        />
      </div>
    </div>

    <div v-if="uploadProgress.total > 0" class="overall-progress">
      <div class="progress-header">
        <span>Overall Progress</span>
        <span class="progress-count">
          {{ uploadProgress.uploaded }} / {{ uploadProgress.total }} images
        </span>
      </div>
      <Progress :percent="uploadProgress.percent" />
    </div>

    <Alert class="info">
      <p>
        <strong>Tip:</strong> You can upload multiple images at once. Just make sure each variant
        is distinct and follows the edition's opepen schematic shape.
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

const handleDynamicImagesUpdate = (updatedImages) => {
  emit('update:formData', {
    ...props.formData,
    dynamicSetImages: updatedImages,
  })
  emit('validate')
}

const uploadProgress = computed(() => {
  const images = props.formData.dynamicSetImages || {}

  // Count required images: 4 + 5 + 10 + 20 + 40 = 79
  const required = {
    edition4: 4,
    edition5: 5,
    edition10: 10,
    edition20: 20,
    edition40: 40,
  }

  let uploaded = 0
  let total = 0

  Object.entries(required).forEach(([edition, count]) => {
    total += count
    for (let i = 1; i <= count; i++) {
      const key = `image${edition.replace('edition', '')}_${i}`
      if (images[key]) uploaded++
    }
  })

  return {
    uploaded,
    total,
    percent: total > 0 ? Math.round((uploaded / total) * 100) : 0,
  }
})

// Validate on mount
onMounted(() => {
  emit('validate')
})
</script>

<style scoped>
.step-dynamic-images {
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

.warning {
  background: var(--warning-bg, rgba(var(--warning-rgb), 0.1));
  border-color: var(--warning);

  strong {
    color: var(--color);
  }
}

.info {
  background: var(--blue-bg, rgba(59, 130, 246, 0.1));
  border-color: var(--blue, #3b82f6);

  strong {
    color: var(--color);
  }
}

.upload-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-lg);
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
}

.section-header {
  h4 {
    @mixin h4;
    margin: 0 0 var(--spacer-xs) 0;
  }

  p {
    @mixin ui-font;
    color: var(--muted);
    font-size: var(--font-sm);
    margin: 0;
  }
}

.overall-progress {
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
  font-weight: 500;
}

.progress-count {
  color: var(--success);
}
</style>
