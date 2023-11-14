<template>
  <div class="opepen" :class="{ disabled }">
    <Icon v-if="! opepen" type="x" />
    <img v-else :src="imageURI(opepen.image, 'sm')" crossorigin="anonymous" />
  </div>
</template>

<script setup>
import { imageURI } from '~/helpers/images'

defineProps({
  opepen: Object,
  disabled: Boolean,
  _id: [String, Number],
})
</script>

<style lang="postcss" scoped>
.opepen {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-z-5);
  transition: background var(--speed);

  &.disabled {
    color: var(--gray-z-3);
    pointer-events: none;
    opacity: 0.5;
  }

  &:not(.disabled) {
    &:hover {
      background: var(--gray-z-2);
    }
  }

  > img {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 0;
    border: 0;
    z-index: 5;
  }
}
</style>
