<template>
  <svg viewBox="0 0 206 206" class="opepen-edition">
    <rect
      x="178"
      y="183"
      width="25"
      height="20"
      stroke="currentColor"
      :fill="
        editions.includes(1) ? highlightColor : mutedEditions.includes(1) ? mutedColor : 'none'
      "
      :stroke-width="stroke"
    />
    <rect
      x="178"
      y="103"
      width="25"
      height="80"
      stroke="currentColor"
      :fill="
        editions.includes(4) ? highlightColor : mutedEditions.includes(4) ? mutedColor : 'none'
      "
      :stroke-width="stroke"
    />
    <rect
      x="153"
      y="103"
      width="25"
      height="100"
      stroke="currentColor"
      :fill="
        editions.includes(5) ? highlightColor : mutedEditions.includes(5) ? mutedColor : 'none'
      "
      :stroke-width="stroke"
    />
    <rect
      x="103"
      y="103"
      width="50"
      height="100"
      stroke="currentColor"
      :fill="
        editions.includes(10)
          ? highlightColor
          : mutedEditions.includes(10)
            ? mutedColor
            : 'none'
      "
      :stroke-width="stroke"
    />
    <rect
      x="3"
      y="103"
      width="100"
      height="100"
      stroke="currentColor"
      :fill="
        editions.includes(20)
          ? highlightColor
          : mutedEditions.includes(20)
            ? mutedColor
            : 'none'
      "
      :stroke-width="stroke"
    />
    <rect
      x="3"
      y="3"
      width="200"
      height="100"
      stroke="currentColor"
      :fill="
        editions.includes(40)
          ? highlightColor
          : mutedEditions.includes(40)
            ? mutedColor
            : 'none'
      "
      :stroke-width="stroke"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  mutedEditions?: number[]
  editions?: number[]
  mutedColor?: string
  highlightColor?: string
  stroke?: number
}

const {
  mutedEditions = [],
  editions = [],
  mutedColor = 'var(--gray-z-4)',
  highlightColor = 'currentColor',
  stroke = 5,
} = defineProps<Props>()
</script>
