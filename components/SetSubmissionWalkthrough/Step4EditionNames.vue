<template>
  <div class="step-edition-names">
    <div class="step-header">
      <h3>Name Each Edition</h3>
      <p class="lead">
        Give each edition size a unique name. These names help collectors identify and appreciate
        the different rarity tiers.
      </p>
    </div>

    <div class="names-list">
      <div
        v-for="edition in editions"
        :key="edition.key"
        class="edition-name-item"
      >
        <div class="edition-preview">
          <Image :image="edition.image" />
          <span class="edition-label">{{ edition.label }}</span>
        </div>
        <div class="edition-input">
          <input
            type="text"
            v-model="editionNames[edition.nameKey]"
            :placeholder="`Name for ${edition.label} edition...`"
            class="input"
            @input="handleUpdate"
          />
          <small v-if="editionNames[edition.nameKey]" class="char-hint">
            {{ editionNames[edition.nameKey].length }} characters
          </small>
        </div>
      </div>
    </div>

    <Alert class="info">
      <p>
        <strong>Naming tips:</strong><br />
        • Choose names that reflect the rarity or theme of each edition<br />
        • Consider names that work together as a collection<br />
        • Examples: "Mythic" (1/1), "Legendary" (1/4), "Epic" (1/5), etc.
      </p>
    </Alert>

    <div v-if="namedCount > 0" class="progress-indicator">
      <Icon type="check-circle" v-if="allNamed" class="success-icon" />
      <Icon type="edit-3" v-else class="edit-icon" />
      <span>{{ namedCount }} of 6 editions named</span>
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

const editionNames = reactive({
  edition1Name: props.formData.edition1Name || '',
  edition4Name: props.formData.edition4Name || '',
  edition5Name: props.formData.edition5Name || '',
  edition10Name: props.formData.edition10Name || '',
  edition20Name: props.formData.edition20Name || '',
  edition40Name: props.formData.edition40Name || '',
})

const editions = computed(() => [
  { key: '1', label: '1/1', image: props.formData.edition1Image, nameKey: 'edition1Name' },
  { key: '4', label: '1/4', image: props.formData.edition4Image, nameKey: 'edition4Name' },
  { key: '5', label: '1/5', image: props.formData.edition5Image, nameKey: 'edition5Name' },
  { key: '10', label: '1/10', image: props.formData.edition10Image, nameKey: 'edition10Name' },
  { key: '20', label: '1/20', image: props.formData.edition20Image, nameKey: 'edition20Name' },
  { key: '40', label: '1/40', image: props.formData.edition40Image, nameKey: 'edition40Name' },
])

const handleUpdate = () => {
  emit('update:formData', {
    ...props.formData,
    ...editionNames,
  })
  emit('validate')
}

const namedCount = computed(() => {
  return Object.values(editionNames).filter(name => name && name.length > 0).length
})

const allNamed = computed(() => namedCount.value === 6)

// Validate on mount
onMounted(() => {
  emit('validate')
})

// Sync with formData changes
watch(() => props.formData, (newData) => {
  Object.keys(editionNames).forEach(key => {
    if (newData[key] !== undefined) {
      editionNames[key] = newData[key]
    }
  })
}, { deep: true })
</script>

<style scoped>
.step-edition-names {
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

.names-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);
}

.edition-name-item {
  display: flex;
  gap: var(--spacer);
  align-items: center;
  padding: var(--spacer-sm);
  border: var(--border);
  border-radius: var(--border-radius);
  background: var(--gray-z-0);

  @media (max-width: 36rem) {
    flex-direction: column;
    align-items: stretch;
  }
}

.edition-preview {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
  min-width: 8rem;

  :deep(.image) {
    width: var(--size-8);
    height: var(--size-8);
    border-radius: var(--border-radius);
  }
}

.edition-label {
  @mixin ui-font;
  font-weight: 600;
  color: var(--color);
}

.edition-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacer-xs);
}

.char-hint {
  @mixin ui-font;
  font-size: var(--font-xs);
  color: var(--muted);
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

  .edit-icon {
    color: var(--muted);
  }
}
</style>
