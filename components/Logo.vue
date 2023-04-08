<template>
  <span>
    <IconsOpepenAiMedium />
    <OpepenAiTextLogo />
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
    }

    > :last-child {
      color: var(--gray-z-9);
      position: relative;
      top: 0.1em;
    }
  }
</style>
