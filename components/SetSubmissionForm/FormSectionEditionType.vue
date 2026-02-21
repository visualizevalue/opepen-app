<template>
  <Card class="static" :disabled="disabled">
    <label class="type">
      <span>Edition Type</span>
      <select v-model="editionType" class="select" :disabled="disabled">
        <option value="DYNAMIC">Dynamic</option>
        <option value="PRINT" default>Prints</option>
        <option v-if="isAdmin" value="NUMBERED_PRINT" default>
          Numbered Prints (Admins only)
        </option>
      </select>
    </label>

    <slot name="help"></slot>
  </Card>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: 'PRINT',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const editionType = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<style scoped>
.type {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);

  span {
    @mixin ui-font;
    color: var(--gray-z-5);
  }
}
</style>
