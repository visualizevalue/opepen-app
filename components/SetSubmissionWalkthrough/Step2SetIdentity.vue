<template>
  <div class="step-set-identity">
    <div class="step-header">
      <h3>Name Your Set</h3>
      <p class="lead">
        Give your Opepen set a unique name and description that captures its essence.
      </p>
    </div>

    <div class="form-fields">
      <label class="field">
        <span class="label">
          Set Name <span class="required">*</span>
        </span>
        <input
          type="text"
          v-model="setName"
          placeholder="e.g., Cosmic Dreams, Digital Zen, Pixel Paradise..."
          class="input"
          minlength="3"
          required
        />
        <small class="hint">
          <span :class="{ valid: isNameValid, invalid: setName && !isNameValid }">
            {{ setName.length }} / 3 minimum characters
          </span>
        </small>
      </label>

      <label class="field">
        <span class="label">
          Description <span class="required">*</span>
        </span>
        <Input
          v-model="setDescription"
          placeholder="Tell the community about your set. What inspired it? What makes it unique?"
          minlength="10"
          required
        />
        <small class="hint">
          <span :class="{ valid: isDescriptionValid, invalid: setDescription && !isDescriptionValid }">
            {{ setDescription.length }} / 10 minimum characters
          </span>
        </small>
      </label>
    </div>

    <Alert class="info">
      <p>
        <strong>Tips for a great submission:</strong><br />
        • Choose a memorable name that reflects your art style<br />
        • Write a description that helps collectors connect with your work<br />
        • Be authentic - your unique voice is what makes your set special
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

const setName = computed({
  get: () => props.formData.name || '',
  set: (value) => {
    emit('update:formData', {
      ...props.formData,
      name: value,
    })
    emit('validate')
  },
})

const setDescription = computed({
  get: () => props.formData.description || '',
  set: (value) => {
    emit('update:formData', {
      ...props.formData,
      description: value,
    })
    emit('validate')
  },
})

const isNameValid = computed(() => setName.value.length >= 3)
const isDescriptionValid = computed(() => setDescription.value.length >= 10)

// Validate on mount
onMounted(() => {
  emit('validate')
})
</script>

<style scoped>
.step-set-identity {
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

.form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-xs);
}

.label {
  @mixin ui-font;
  color: var(--gray-z-6);
  font-weight: 500;
}

.required {
  color: var(--warning);
}

.hint {
  @mixin ui-font;
  font-size: var(--font-xs);
  color: var(--muted);

  .valid {
    color: var(--success);
  }

  .invalid {
    color: var(--warning);
  }
}

.info {
  background: var(--blue-bg, rgba(59, 130, 246, 0.1));
  border-color: var(--blue, #3b82f6);

  strong {
    color: var(--color);
  }

  br {
    margin-bottom: var(--spacer-xs);
  }
}
</style>
