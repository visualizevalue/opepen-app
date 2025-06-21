<template>
  <div class="progress">
    <div :style="{ width: `${Math.max(3, percent)}%` }" class="primary-bar"></div>

    <NuxtLink
      v-if="secondaryPercent && secondaryLink"
      :to="secondaryLink"
      :style="{ width: `${Math.max(1, secondaryPercent)}%` }"
      class="secondary-bar"
    >
      <div :style="{ right: 0 }" class="secondary-label"><slot name="secondary" /></div>
    </NuxtLink>

    <div :style="{ left: `${percent}%` }" class="label"><slot name="primary" /></div>
  </div>
</template>

<script setup>
defineProps({
  percent: {
    type: Number,
    default: 0,
  },
  secondaryPercent: {
    type: Number,
    default: 0,
  },
  secondaryLink: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.progress {
  padding: 0;
  background-color: var(--gray-z-2);
  border-radius: var(--size-1);
  position: relative;
  height: var(--size-1);
  @mixin ui-font;

  .primary-bar {
    height: var(--size-1);
    width: var(--size-0);
    background-color: var(--success);
    border-radius: var(--size-0);
    transition: width var(--speed);
    position: absolute;
    left: 0;
  }

  .secondary-bar {
    height: var(--size-1);
    width: var(--size-0);
    background-color: var(--red);
    border-radius: var(--size-0);
    transition:
      width var(--speed),
      opacity var(--speed);
    position: absolute;
    right: 0;
    display: block;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  &.muted .primary-bar {
    background-color: var(--gray-z-4);
  }

  &.yellow .primary-bar {
    background-color: var(--yellow);
  }

  &.red .primary-bar {
    background-color: var(--red);
  }

  .label {
    font-size: var(--font-sm);
    color: var(--gray-z-6);
    position: absolute;
    top: var(--size-2);
    left: auto;
    text-align: center;
    width: 20rem;
    margin-left: -9.7rem;
  }

  .secondary-label {
    font-size: var(--font-sm);
    color: var(--gray-z-6);
    position: absolute;
    top: var(--size-2);
    left: auto;
    text-align: center;
    margin-left: -9.7rem;
  }
}
</style>
