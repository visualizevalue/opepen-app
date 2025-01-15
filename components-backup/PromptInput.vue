<template>
  <Input
    :model-value="modelValue"
    @update:model-value="prompt => $emit('update:modelValue', prompt)"
    @enter="onEnter"
    placeholder="Opepen prompt..."
    class="prompt-input icon-after"
    :class="{
      'icon-before': ! expanded,
    }"
  >
    <template v-if="! expanded" #before>
      <IconsOpepenAiBold />
    </template>
    <template #after>
      <Icon type="corner-down-left" :stroke-width="3" @click="$emit('submit')" />
    </template>
  </Input>
</template>

<script setup>
defineProps(['modelValue', 'expanded'])
const emit = defineEmits(['update:modelValue', 'submit'])

const onEnter = event => {
  event.preventDefault()
  event.stopPropagation()

  emit('submit')
}
</script>

<style scoped>
  .input {
    :deep(.icon:first-child)  {
      color: var(--gray-z-7);
    }

    :deep(.vue-feather)  {
      color: var(--gray-z-5);
    }
  }
</style>
