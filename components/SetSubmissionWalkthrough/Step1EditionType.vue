<template>
  <div class="step-edition-type">
    <div class="step-header">
      <h3>Choose Your Edition Type</h3>
      <p class="lead">
        Decide whether your set will use static images (Prints) or dynamic variants (Dynamic).
      </p>
    </div>

    <Alert class="info">
      <p>
        <strong>What's the difference?</strong><br />
        Print sets use the same 6 images for all Opepen. Dynamic sets allow you to upload unique
        variants for each edition size, creating more visual diversity (80+ total images).
      </p>
    </Alert>

    <div class="edition-options">
      <label
        class="edition-option"
        :class="{ selected: editionType === 'PRINT' }"
      >
        <input
          type="radio"
          value="PRINT"
          v-model="editionType"
          name="edition-type"
        />
        <div class="option-content">
          <div class="option-header">
            <Icon type="image" />
            <span class="option-title">Print</span>
            <span class="recommended-badge">Recommended for first-timers</span>
          </div>
          <p class="option-description">
            Upload 6 base images (one for each edition size). Simpler and faster to create.
          </p>
          <ul class="option-features">
            <li>6 images total</li>
            <li>Same image for all Opepen in each edition</li>
            <li>Perfect for collections with unified aesthetics</li>
          </ul>
        </div>
      </label>

      <label
        class="edition-option"
        :class="{ selected: editionType === 'DYNAMIC' }"
      >
        <input
          type="radio"
          value="DYNAMIC"
          v-model="editionType"
          name="edition-type"
        />
        <div class="option-content">
          <div class="option-header">
            <Icon type="layers" />
            <span class="option-title">Dynamic</span>
          </div>
          <p class="option-description">
            Upload unique variants for each Opepen in each edition. More work, more variety.
          </p>
          <ul class="option-features">
            <li>80+ images total (6 base + 74 variants)</li>
            <li>Each Opepen in an edition gets a unique variant</li>
            <li>Maximum creative expression and rarity</li>
          </ul>
        </div>
      </label>
    </div>

    <Alert v-if="editionType === 'DYNAMIC'" class="warning">
      <p>
        <strong>Note:</strong> Dynamic sets require significantly more work. You'll need to upload
        variants for each edition (4 variants for 1/4, 5 for 1/5, up to 40 for 1/40). Consider
        starting with a Print set if this is your first submission.
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

const editionType = computed({
  get: () => props.formData.edition_type || 'PRINT',
  set: (value) => {
    emit('update:formData', {
      ...props.formData,
      edition_type: value,
    })
    emit('validate')
  },
})

// Validate on mount
onMounted(() => {
  emit('validate')
})
</script>

<style scoped>
.step-edition-type {
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

.edition-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacer);
}

.edition-option {
  display: flex;
  gap: var(--spacer);
  padding: var(--spacer);
  border: var(--border);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--speed);
  background: var(--gray-z-0);

  &:hover {
    border-color: var(--gray-z-4);
    background: var(--gray-z-1);
  }

  &.selected {
    border-color: var(--success);
    background: var(--success-bg, rgba(var(--success-rgb), 0.05));
  }

  input[type="radio"] {
    margin-top: var(--spacer-xs);
    flex-shrink: 0;
  }
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);
}

.option-header {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);

  :deep(svg) {
    width: var(--size-5);
    height: var(--size-5);
    color: var(--gray-z-5);
  }
}

.option-title {
  font-weight: 600;
  font-size: var(--font-md);
  color: var(--color);
}

.recommended-badge {
  @mixin ui-font;
  font-size: var(--font-xs);
  color: var(--success);
  background: var(--success-bg, rgba(var(--success-rgb), 0.1));
  padding: var(--spacer-xs) var(--spacer-sm);
  border-radius: var(--border-radius);
  margin-left: auto;
}

.option-description {
  color: var(--gray-z-6);
  margin: 0;
  font-size: var(--font-sm);
}

.option-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacer-xs);

  li {
    @mixin ui-font;
    font-size: var(--font-sm);
    color: var(--gray-z-5);
    padding-left: var(--spacer);
    position: relative;

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--success);
    }
  }
}

.info {
  background: var(--blue-bg, rgba(59, 130, 246, 0.1));
  border-color: var(--blue, #3b82f6);

  strong {
    color: var(--color);
  }
}

.warning {
  background: var(--warning-bg, rgba(var(--warning-rgb), 0.1));
  border-color: var(--warning);

  strong {
    color: var(--color);
  }
}
</style>
