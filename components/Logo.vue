<template>
  <span>
    <IconsOpepenAiMedium />
    <OpepenAiTextLogo />
    <slot />
  </span>
</template>

<style lang="postcss" scoped>
  span {
    display: flex;
    align-items: center;
    gap: var(--size-3);

    > :first-child {
      width: var(--size-7);
      height: var(--size-7);
      color: var(--gray-z-7);

      @media (--max-sm) {
        width: var(--size-6);
        height: var(--size-6);
      }
    }

    > :last-child {
      color: var(--gray-z-9);
      position: relative;
      top: 0.1em;

      @media (--max-sm) {
        height: var(--size-4);
        width: auto;
      }
    }
  }
</style>
