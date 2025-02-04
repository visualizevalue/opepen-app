<template>
  <div>
    <section>
      <h1>Colors</h1>
      <div class="colors">
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .colors {
    display: flex;
    justify-content: center;
    gap: var(--size-2);

    .color {
      width: var(--size-9);
      height: var(--size-9);

      &:nth-child(1) { background-color: var(--background); }
      &:nth-child(2) { background-color: var(--gray-z-1); }
      &:nth-child(3) { background-color: var(--gray-z-2); }
      &:nth-child(4) { background-color: var(--gray-z-3); }
      &:nth-child(5) { background-color: var(--gray-z-4); }
      &:nth-child(6) { background-color: var(--gray-z-5); }
      &:nth-child(7) { background-color: var(--gray-z-6); }
      &:nth-child(8) { background-color: var(--gray-z-7); }
      &:nth-child(9) { background-color: var(--gray-z-8); }
      &:nth-child(10) { background-color: var(--gray-z-9); }
      &:nth-child(11) { background-color: var(--color); }
    }
  }
</style>
