<template>
<Card class="opepen-card">
  <div @click="onClick">
    <Image :image="token.image" version="sm" :auto-embed="false" />

    <div class="text">
      <slot name="title">
        <h1>{{ token.name }}</h1>
      </slot>
      <slot name="subline">
        <p>Edition of {{ set }}</p>
      </slot>
    </div>

    <NuxtLink :to="uri || `/opepen/${token.token_id}`"><span>View Opepen #{{ token.token_id }}</span></NuxtLink>
  </div>
</Card>
</template>

<script setup>
import { formatEther } from 'viem'

const {
  token,
  set,
  rotate,
  uri,
} = defineProps({
  token: Object,
  set: [Number, String],
  rotate: {
    type: Boolean,
    default: false,
  },
  uri: String,
})
</script>

<style scoped>
.opepen-card {
  position: relative;
  width: 100%;
  height: 0;
  padding: 0;
  padding-bottom: 125%;
  border: 0;

  /* Inner */
  > div {
    container-type: inline-size;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--gray-z-1);
    border: var(--border);
    border-radius: var(--border-radius);
    overflow: hidden;
    display: grid;
    grid-template-rows: 4fr 1fr;

    :deep(.image > .inner),
    :deep(.image > .image) {
      border: none !important;
      border-radius: 0;
    }
    :deep(.image) {
      border-bottom: var(--border);
    }

    img {
      border-bottom: var(--border);
    }

    .text {
      padding: 0 var(--size-4);
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-transform: uppercase;
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--letter-spacing-md);
      user-select: none;
      line-height: 1;
      width: 100%;
      overflow: hidden;

      :deep(h1) {
        font-size: 6cqw;
        margin-bottom: 2cqw;

        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      :deep(p) {
        font-size: 4.5cqw;
        color: var(--gray-z-7);
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        display: flex;
        align-items: center;
        justify-content: space-between
      }
    }

    a {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.00001;
    }
  }
}
</style>
