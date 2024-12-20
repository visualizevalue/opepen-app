<template>
  <div class="code-editor">
    <CodeMirror
      :value="modelValue"
      :options="cmOptions"
      height="100%"
      :placeholder="placeholder"
      @change="$emit('update:modelValue', $event)"
      original-style
    />
  </div>
</template>

<script setup>
import CodeMirror from 'codemirror-editor-vue3'
import 'codemirror/addon/display/placeholder.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/theme/ayu-dark.css'

const props = defineProps({
  modelValue: String,
  placeholder: String,
  mode: {
    type: String,
    default: 'text/javascript'
  },
})
const emit = defineEmits(['update:modelValue'])

const cmOptions = computed(() => ({
  mode: props.mode,
  theme: 'ayu-dark',
  indentUnit: 2,
  tabSize: 2,
  indentWithTab: false
}))
</script>

<style lang="postcss" scoped>
.code-editor {
  text-transform: none;
  height: 100%;

  :deep(.CodeMirror) {
    padding-top: var(--size-3);
    height: 100%;
  }
}
</style>
