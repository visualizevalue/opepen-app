<template>
  <div class="loader">
    <!-- <span class="spinner"></span> -->
    <IconsOpepenAiBold />
    <span v-if="txt" class="text">{{ txt }}</span>
  </div>
</template>

<script setup>
const { txt } = defineProps({
  txt: {
    type: String,
    default: 'Loading...',
  },
})
</script>

<style lang="postcss" scoped>
.loader {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25em;

  .text {
    text-transform: uppercase;
    font-weight: var(--font-weight-bold);
  }

  &:not(.inline) {
    text-align: center;
    margin: calc(var(--size-6)) 0;
  }

  &.inline {
    display: inline-flex;
    gap: var(--size-1);
    margin-left: var(--size-1);
  }

  &.large {
    font-size: var(--font-size-xl);

    .spinner {
      border-width: 4px;
    }
  }

  &.simple {
    .text {
      display: none;
    }
  }

  .spinner {
    position: relative;
    display: inline-block;
    width: 0.75em;
    height: 0.75em;
    border-radius: 50%;
    border: 2px solid var(--gray-z-6);
    border-right-color: var(--gray-z-3);
    flex-shrink: 0;
    animation: spin infinite linear 1s;
  }

  .icon {
    color: var(--gray-z-8);
    animation: opepenSpin infinite ease-in-out 1.5s;
    width: var(--size-5);
    height: var(--size-5);

    + span {
      margin-left: var(--size-2);
    }
  }
}

@keyframes opepenSpin {
  0% {
    transform: rotate(0);
  }
  70% {
    transform: rotate(400deg);
  }
  88% {
    transform: rotate(320deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
