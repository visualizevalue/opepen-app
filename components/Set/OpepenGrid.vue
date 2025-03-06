<template>
  <section class="set-opepen-grid">
    <slot />
  </section>
</template>

<style scoped>
.set-opepen-grid {
  display: grid;
  gap: var(--spacer-lg);
}

:slotted(.list) {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
  container-type: inline-size;
  flex-wrap: wrap;
  margin: 0 auto;
  gap: var(--spacer-sm);

  > h1 {
    grid-column: 1/-1;
    margin-bottom: var(--spacer-sm);
  }

  > div {
    width: 100%;
    cursor: pointer;
  }

  &.list-1 {
    grid-template-columns: 1fr;

    @container (min-width: 35rem) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    > h1 {
      margin-top: 0;
    }
  }

  &.list-1,
  &.list-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    @container (min-width: 35rem) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  &.list-5
  &.list-10,
  &.list-20,
  &.list-40 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-columns: repeat(5, minmax(0, 1fr));

    @container (min-width: 35rem) {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }
  }
}
</style>

