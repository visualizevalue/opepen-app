<template>
  <div class="attribute" :class="{ 'has-link': attribute.link }">
    <span>{{ attribute.trait_type }}</span>
    <small>{{ attribute.value }}</small>

    <NuxtLink v-if="attribute.link" :to="attribute.link"><span>View {{ attribute.value }}</span></NuxtLink>
  </div>
</template>

<script setup >
const { attribute } = defineProps({
  attribute: Object,
})
</script>

<style lang="postcss" scoped>
.attribute {
  padding: var(--size-2) var(--size-4);
  background-color: var(--gray-z-1);
  border: var(--border);
  border-radius: var(--size-3);
  border-top-left-radius: var(--size-1);
  position: relative;
  transition: all var(--speed);

  > * {
    text-align: center;
    display: block;
    font-size: var(--font-sm);
  }

  > span {
    color: var(--gray-z-6);
  }

  > a {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    > span {
      opacity: 0.0001;
    }
  }

  &.has-link {
    &:--highlight {
      background: var(--gray-z-2);
    }
  }
}
</style>
