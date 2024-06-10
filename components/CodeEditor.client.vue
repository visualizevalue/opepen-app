<template>
  <div class="code-editor">
    <CodeMirror
      v-model:value="code"
      :options="cmOptions"
      placeholder="test placeholder"
      @change="change"
      original-style
    />
  </div>
</template>

<script setup>
import CodeMirror from 'codemirror-editor-vue3'
import 'codemirror/addon/display/placeholder.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/theme/ayu-dark.css'

const code = ref(`
var i = 0;
for (; i < 9; i++) {
console.log(i);
// more statements
}`)

const change = (value, cm) => {
  console.log('change', value, 'cm', cm)
}

const cmOptions = {
  mode: 'text/javascript',
  theme: 'ayu-dark',
}
</script>

<style lang="postcss">
.code-editor {
  text-transform: none;

  :deep(.CodeMirror) {
    background-color: var(--gray-z-0);
  }
}
</style>
