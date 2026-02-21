<template>
  <div class="step-artist-info">
    <div class="step-header">
      <h3>Artist Information</h3>
      <p class="lead">
        Tell us about yourself and any collaborators on this set.
      </p>
    </div>

    <div class="form-fields">
      <label class="field">
        <span class="label">
          Artist Name <span class="required">*</span>
        </span>
        <input
          type="text"
          v-model="artistName"
          placeholder="Your artist name or pseudonym"
          class="input"
          required
        />
        <small class="hint">
          This is how you'll be credited for the set
        </small>
      </label>

      <label class="field">
        <span class="label">
          Co-Creator Addresses <span class="optional">(Optional)</span>
        </span>
        <SortableList
          :items="coCreatorsList"
          @update="updateCoCreators"
          class="co-creators-list"
        >
          <template v-slot="{ item, index }">
            <input
              type="text"
              :value="item.address"
              @input="handleCoCreatorInput(index, $event.target.value)"
              placeholder="0x0000...0000"
              class="input"
            />
          </template>
        </SortableList>
        <small class="hint">
          Add Ethereum addresses of any co-creators or collaborators. They'll share attribution
          for this set.
        </small>
      </label>
    </div>

    <Alert class="info">
      <p>
        <strong>About co-creators:</strong><br />
        Co-creators are other artists or collaborators who contributed to this set. Adding their
        addresses gives them shared credit and visibility.
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

const artistName = computed({
  get: () => props.formData.artist || '',
  set: (value) => {
    emit('update:formData', {
      ...props.formData,
      artist: value,
    })
    emit('validate')
  },
})

const withEmptyCoCreators = (list) => {
  if (!list.length || list[list.length - 1].address !== '') {
    list.push({ id: list.length, address: '' })
  }
  return list
}

const sortableCoCreators = (list) => {
  const array = Array.isArray(list)
    ? list.filter((address) => !!address).map((address) => ({ id: address, address }))
    : [{ id: 0, address: '' }]

  return withEmptyCoCreators(array)
}

const coCreatorsList = ref(
  sortableCoCreators(props.formData.coCreators || [])
)

watch(() => props.formData.coCreators, (newCreators) => {
  if (newCreators) {
    coCreatorsList.value = sortableCoCreators(newCreators)
  }
}, { deep: true })

watch(coCreatorsList, () => {
  coCreatorsList.value = withEmptyCoCreators(coCreatorsList.value)
}, { deep: true })

const handleCoCreatorInput = (index, value) => {
  coCreatorsList.value[index].address = value
  updateCoCreators(coCreatorsList.value)
}

const updateCoCreators = (list) => {
  coCreatorsList.value = list
  const addresses = list
    .map((c) => c.address?.trim().toLowerCase())
    .filter((address) => address && address.match(/^0x[a-fA-F0-9]{40}$/))

  emit('update:formData', {
    ...props.formData,
    coCreators: addresses,
  })
  emit('validate')
}

// Validate on mount
onMounted(() => {
  emit('validate')
})
</script>

<style scoped>
.step-artist-info {
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

.optional {
  color: var(--muted);
  font-weight: normal;
}

.hint {
  @mixin ui-font;
  font-size: var(--font-xs);
  color: var(--muted);
}

.co-creators-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-xs);
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
