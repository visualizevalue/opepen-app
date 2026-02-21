<template>
  <Card class="static grid meta" :disabled="disabled">
    <label class="name span-2">
      <input
        class="input"
        type="text"
        v-model="setName"
        placeholder="Set Name"
        :disabled="disabled"
        :minlength="3"
        required
      />
      <small v-if="showCharCount && setName" class="char-count">
        {{ setName.length }} characters {{ setName.length < 3 ? '(minimum 3)' : '' }}
      </small>
    </label>

    <label class="description span-2">
      <Input
        v-model="setDescription"
        :disabled="disabled"
        placeholder="Description"
        :minlength="10"
      />
      <small v-if="showCharCount && setDescription" class="char-count">
        {{ setDescription.length }} characters {{ setDescription.length < 10 ? '(minimum 10)' : '' }}
      </small>
    </label>

    <slot></slot>
  </Card>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showCharCount: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:name', 'update:description'])

const setName = computed({
  get: () => props.name,
  set: (value) => emit('update:name', value),
})

const setDescription = computed({
  get: () => props.description,
  set: (value) => emit('update:description', value),
})
</script>

<style scoped>
.grid {
  display: grid;
  gap: var(--spacer);

  @container page (min-width: 36rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .span-2 {
      grid-column: span 2;
    }
  }
}

.meta {
  container-type: inline-size;
}

label {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-xs);
}

.char-count {
  @mixin ui-font;
  color: var(--muted);
  font-size: var(--font-xs);
  margin-top: var(--spacer-xs);
}
</style>
