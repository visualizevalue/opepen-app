<template>
  <div class="step-base-images">
    <div class="step-header">
      <h3>Upload Base Edition Images</h3>
      <p class="lead">
        Upload one image for each of the 6 edition sizes. These are your core artworks.
      </p>
    </div>

    <Alert class="info">
      <p>
        <strong>Base your art on the opepen schematics.</strong> The schematics define the iconic
        shapes for each edition. Click below to view them.
      </p>
      <Actions>
        <Button
          to="https://raw.githubusercontent.com/visualizevalue/opepen-api/refs/heads/main/app/Services/OpepenSVG/opepen-schematics.svg"
          target="_blank"
          class="small"
        >
          <Icon type="external-link" />
          <span>View Opepen Schematics</span>
        </Button>
      </Actions>
    </Alert>

    <div class="images-grid">
      <div class="image-upload-item featured">
        <label class="upload-label">1/1 Edition <span class="required">*</span></label>
        <ImageUpload
          @stored="updateImage('edition1Image', $event)"
          name="1/1 Media"
          :image="images.edition1Image"
        />
        <p class="edition-info">The rarest piece - only 1 exists</p>
      </div>

      <div class="image-upload-item">
        <label class="upload-label">1/4 Edition <span class="required">*</span></label>
        <ImageUpload
          @stored="updateImage('edition4Image', $event)"
          name="1/4 Media"
          :image="images.edition4Image"
        />
        <p class="edition-info">4 pieces total</p>
      </div>

      <div class="image-upload-item">
        <label class="upload-label">1/5 Edition <span class="required">*</span></label>
        <ImageUpload
          @stored="updateImage('edition5Image', $event)"
          name="1/5 Media"
          :image="images.edition5Image"
        />
        <p class="edition-info">5 pieces total</p>
      </div>

      <div class="image-upload-item">
        <label class="upload-label">1/10 Edition <span class="required">*</span></label>
        <ImageUpload
          @stored="updateImage('edition10Image', $event)"
          name="1/10 Media"
          :image="images.edition10Image"
        />
        <p class="edition-info">10 pieces total</p>
      </div>

      <div class="image-upload-item">
        <label class="upload-label">1/20 Edition <span class="required">*</span></label>
        <ImageUpload
          @stored="updateImage('edition20Image', $event)"
          name="1/20 Media"
          :image="images.edition20Image"
        />
        <p class="edition-info">20 pieces total</p>
      </div>

      <div class="image-upload-item">
        <label class="upload-label">1/40 Edition <span class="required">*</span></label>
        <ImageUpload
          @stored="updateImage('edition40Image', $event)"
          name="1/40 Media"
          :image="images.edition40Image"
        />
        <p class="edition-info">40 pieces - the most common</p>
      </div>
    </div>

    <div v-if="uploadedCount > 0" class="progress-indicator">
      <Icon type="check-circle" v-if="allImagesUploaded" class="success-icon" />
      <Icon type="upload-cloud" v-else class="upload-icon" />
      <span>{{ uploadedCount }} of 6 images uploaded</span>
    </div>
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

const images = computed(() => ({
  edition1Image: props.formData.edition1Image,
  edition4Image: props.formData.edition4Image,
  edition5Image: props.formData.edition5Image,
  edition10Image: props.formData.edition10Image,
  edition20Image: props.formData.edition20Image,
  edition40Image: props.formData.edition40Image,
}))

const updateImage = (key, value) => {
  emit('update:formData', {
    ...props.formData,
    [key]: value,
  })
  emit('validate')
}

const uploadedCount = computed(() => {
  return Object.values(images.value).filter(img => !!img).length
})

const allImagesUploaded = computed(() => uploadedCount.value === 6)

// Validate on mount
onMounted(() => {
  emit('validate')
})
</script>

<style scoped>
.step-base-images {
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

.info {
  background: var(--blue-bg, rgba(59, 130, 246, 0.1));
  border-color: var(--blue, #3b82f6);

  strong {
    color: var(--color);
  }
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--spacer);
}

.image-upload-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-xs);

  &.featured {
    grid-column: span 2;

    :deep(.image-upload) {
      aspect-ratio: 1;
    }
  }
}

.upload-label {
  @mixin ui-font;
  color: var(--gray-z-6);
  font-weight: 500;
  font-size: var(--font-sm);
}

.required {
  color: var(--warning);
}

.edition-info {
  @mixin ui-font;
  font-size: var(--font-xs);
  color: var(--muted);
  margin: 0;
}

.progress-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
  padding: var(--spacer-sm) var(--spacer);
  background: var(--gray-z-1);
  border-radius: var(--border-radius);
  @mixin ui-font;
  color: var(--gray-z-6);

  :deep(svg) {
    width: var(--size-5);
    height: var(--size-5);
  }

  .success-icon {
    color: var(--success);
  }

  .upload-icon {
    color: var(--muted);
  }
}
</style>
