<template>
  <span>
    <IconsOpepenAiMedium />
    <span class="text">Opepen</span>
    <slot />
  </span>
</template>

<style scoped>
  span {
    display: flex;
    align-items: center;
    gap: var(--size-3);

    > :first-child {
      width: var(--font-title);
      height: var(--font-title);
      color: var(--gray-z-7);

      @media (--max-sm) {
        width: var(--size-6);
        height: var(--size-6);
      }
    }

    > :last-child {
      color: var(--gray-z-9);
      position: relative;

      @media (--max-sm) {
        height: var(--size-4);
        width: auto;
      }
    }
  }

  .text {
    font-size: 2rem;
  }
</style>
