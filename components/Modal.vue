<template>
<Teleport to="body">
  <div class="modal" :class="[
    open ? 'open' : '',
    modalClasses,
  ]">
    <div class="overlay" @click="clickOutside && $emit('close')"></div>

    <Transition name="modal">
      <section v-if="open" :class="{ 'is-scrollable': scroll }">
        <button v-if="xClose" @click="$emit('close')">
          <Icon type="x" />
        </button>
        <div v-if="scroll" class="scroll">
          <slot />
        </div>
        <template v-else>
          <h1 v-if="title">{{ title }}</h1>
          <slot />
        </template>
      </section>
    </Transition>
  </div>
</Teleport>
</template>

<script setup>
const { open, title, scroll } = defineProps({
  open: Boolean,
  clickOutside: {
    type: Boolean,
    default: true,
  },
  xClose: {
    type: Boolean,
    default: true,
  },
  title: String,
  scroll: Boolean,
  modalClasses: String,
})

defineEmits(['close'])
</script>

<style lang="postcss" scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all var(--speed);
  pointer-events: none;

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--semi);
    backdrop-filter: blur(var(--size-2));
    opacity: 0;
    transition: all var(--speed);
  }

  &.open {
    pointer-events: all;

    .overlay {
      opacity: 1;
    }
  }

  section {
    position: fixed;
    z-index: 300;
    width: 100%;
    margin-bottom: var(--size-6);
    max-width: min(calc(100vw - 2*var(--size-4)), 30rem);
    max-height: calc(var(--100vh) - var(--size-4) * 2);
    background: var(--background);
    padding: var(--size-6) var(--size-5);
    transform: translateY(0);
    transition: all var(--speed);
    border: var(--border-dark);
    border-radius: var(--size-4);
    border-top-left-radius: var(--size-1);
    overflow: hidden;

    h1 {
      text-align: center;
      text-transform: uppercase;
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--letter-spacing-md);
      margin: 0 var(--size-4) var(--size-4);
    }

    button {
      position: absolute;
      top: var(--size-5);
      right: var(--size-3);
      width: var(--size-6);
      z-index: 10;

      &:--highlight {
        outline: none;
      }
    }

    &.is-scrollable {
      max-height: calc(0.8 * var(--100vh));
      padding: 0;

      :deep(.scroll) {
        max-height: calc(0.8 * var(--100vh));
        height: 100%;
      }
    }

    &.modal-enter-active,
    &.modal-leave-active {
      transition: all var(--speed) ease;
    }

    &.modal-enter-from,
    &.modal-leave-to {
      opacity: 0;
      transform: translateY(var(--size-5)) scale(0.9);
    }
  }

  &.wide {
    section {
      max-width: min(calc(100vw - 2*var(--size-4)), var(--content-width));
    }
  }

  :deep(.actions) {
    margin: var(--size-7) 0 calc(-1 * var(--size-6));
    overflow: hidden;
    border-top: var(--border);
    gap: 0;

    .button {
      width: 100%;
    }
  }
}
</style>
