<template>
  <div class="input">
    <slot name="before" />

    <textarea
      ref="textarea"
      :value="modelValue"
      :placeholder="placeholder"
      @focus="onInput"
      @input="onInput"
      @keydown.enter="$emit('enter', $event)"
      rows="1"
    ></textarea>

    <slot name="after" />
  </div>
</template>

<script setup>
import { useElementBounding } from '@vueuse/core'

const props = defineProps(['modelValue', 'placeholder'])
const emit = defineEmits(['update:modelValue', 'enter'])

const textarea = ref(null)
const { height } = useElementBounding(textarea)
const setHeight = () => {
  if (props.modelValue === '') {
    textarea.value.style.height = null
  }

  if (height.value < textarea.value.scrollHeight) {
    textarea.value.style.height = textarea.value.scrollHeight + 2 + 'px'
  }
}

onMounted(() => setHeight())
const onInput = event => {
  emit('update:modelValue', event.target.value)

  // Adjust the height of the area on input
  setTimeout(() => setHeight(), 0)
}
</script>
