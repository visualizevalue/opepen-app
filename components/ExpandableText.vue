<template>
  <span :class="{ expanded }" v-html="visibleText"></span>
  <slot
    name="trigger"
    v-if="wasShortened"
    :expanded="expanded"
    :toggle="toggle"
  >
    <Button v-if="wasShortened" @click="toggle" class="small">
      <Icon :type="expanded ? 'chevron-up' : 'chevron-right'" />
      <span>{{ expanded ? collapseText : expandText }}</span>
    </Button>
  </slot>
</template>

<script setup>
import { cleanText, shortenedCleanText } from '~/helpers/strings'

const { length, text } = defineProps({
  length: {
    type: Number,
    default: 120,
  },
  text: String,
  expandText: {
    type: String,
    default: 'Expand',
  },
  collapseText: {
    type: String,
    default: 'Collapse',
  },
})

const shortened = computed(() => shortenedCleanText(text, 120))
const wasShortened = computed(() => shortened.value !== cleanText(text))
const expanded = ref(false)
const toggle = () => expanded.value = !expanded.value

const visibleText = computed(() => wasShortened.value && !expanded.value ? shortened.value : text)
</script>

<style lang="postcss" scoped>
span.expanded {
  white-space: pre-wrap;
}

.button {
  margin-top: var(--size-3);
}
</style>
