<template>
  <ul>
    <slot />
  </ul>
</template>

<style scoped>
  ul {
    display: grid;
    gap: var(--size-2);

    @container (min-width: 30rem) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    :deep(li),
    :deep(li > a) {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: var(--size-2);
      transition: all var(--speed);
      @mixin ui-font;
      color: var(--gray-z-6);

      > svg, i, .vue-feathers {
        width: var(--size-4);
        height: var(--size-4);
        margin: 0;
        color: var(--gray-z-5);
        transition: all var(--speed);

        &.published {
          color: var(--success);
        }
      }
    }

    :deep(li a) {
      &:--highlight {
        color: var(--color);

        > svg, i, .vue-feathers {
          color: var(--gray-z-6);
        }
      }
    }
  }
</style>
