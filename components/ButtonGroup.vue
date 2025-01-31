<template>
  <div class="button-group">
    <slot />
  </div>
</template>

<style scoped>
div {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  overflow: hidden;

  > :deep(.button) {
    padding: 0 var(--size-4) 0;

    &:not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    &:not(:first-child) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: -1px;
    }
  }
}
</style>
