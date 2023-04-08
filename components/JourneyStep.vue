<template>
  <section>
    <header>
      <span class="step-input">
        <IconsOpepenAiBold />
      </span>
      <h1>{{ step.prompt }}</h1>
    </header>
  </section>
</template>

<script setup>
defineProps({
  step: Object,
})
</script>

<style lang="postcss" scoped>
  section {
    max-width: var(--content-width);
    margin: var(--size-6) auto;
    padding-left: calc(var(--size-4) + var(--size-6));
  }

  header {
    display: flex;
    align-items: center;
    gap: var(--size-3);

    .step-input {
      width: var(--size-7);
      height: var(--size-7);
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--gray-z-3);
      border: 1px solid var(--gray-z-4);
      border-radius: var(--size-3);
      border-top-left-radius: var(--size-1);
      overflow: hidden;

      .icon {
        width: var(--size-4);
        height: var(--size-4);
        color: var(--gray-z-5);
      }
    }


    h1 {
      font-weight: var(--font-weight-medium);
      color: var(--gray-z-5);
    }
  }
</style>
