<template>
  <Loading v-if="! data" />
  <div v-else class="opepen-swipe" :class="{ loading }">
    <button @click="() => vote(false)" :style="buttonLeftStyle"><Icon type="uncheck" /></button>
    <div
      ref="container"
      class="swipe"
      :class="{ animated: !isSwiping, [direction]: true, }"
      :style="swipeStyle"
    >
      <Image :image="data" :key="data.uuid" @loaded="imgLoaded = true" />
    </div>
    <button @click="() => vote(true)" :style="buttonRightStyle"><Icon type="check" /></button>
  </div>

</template>

<script setup>
import { useSwipe } from '@vueuse/core'

const config = useRuntimeConfig()
const emit = defineEmits(['voted'])

const { data, pending, refresh } = await useFetch(`${config.public.opepenApi}/votes/votable`)

const imgLoaded = ref(false)
const voting = ref(false)
const loading = computed(() => pending.value || !imgLoaded.value)

const vote = async (approve) => {
  voting.value = true

  await $fetch(`${config.public.opepenApi}/votes`, {
    credentials: 'include',
    method: 'POST',
    body: {
      image: data.value.uuid,
      approve,
    }
  })

  imgLoaded.value = false
  await refresh()

  emit('voted')

  voting.value = false
}

// Swipe logic
const container = ref(null)
const containerWidth = computed(() => container.value?.offsetWidth)
const positionX = ref(0)
const percentage = computed(() => positionX.value / containerWidth.value)
const absPercentage = computed(() => Math.abs(percentage.value))
const rotation = computed(() => percentage.value * 10)
const { isSwiping, direction, lengthX } = useSwipe(container, {
  passive: false,
  onSwipe () {
    positionX.value = -1 * lengthX.value
  },
  async onSwipeEnd() {
    if (containerWidth.value && (Math.abs(lengthX.value) / containerWidth.value) >= 0.69) {
      await vote(positionX.value > 0)
    }

    positionX.value = 0
  },
})

const swipeStyle = computed(() => ({
  transform: `translateX(${positionX.value}px) rotate(${rotation.value}deg)`,
  opacity: (positionX === 0 ? 1 : 1 - absPercentage.value) + ' !important',
}))
const buttonStyle = computed(() => ({
  opacity: loading.value ? '0 !important' : 1 - absPercentage.value + ' !important',
  transform: `translateY(${absPercentage.value * 32}px)`
}))
const buttonLeftStyle = computed(() => {
  const isLeft = positionX.value < 0

  return {
    opacity: isLeft ? '1 ' : buttonStyle.value.opacity,
    transform: isLeft
      ? `translateY(${-32 * absPercentage.value}px) translateX(${16 * absPercentage.value}px) scale(${1 + absPercentage.value * 0.125})`
      : buttonStyle.value.transform,
    color: positionX.value < 0 ? 'var(--red)' : 'var(--gray-z-5)',
  }
})
const buttonRightStyle = computed(() => {
  const isRight = positionX.value > 0

  return {
    opacity: isRight ? '1 ' : buttonStyle.value.opacity,
    transform: isRight
      ? `translateY(${-32 * absPercentage.value}px) translateX(${-16 * absPercentage.value}px) scale(${1 + absPercentage.value * 0.125})`
      : buttonStyle.value.transform,
  }
})
// const positionX = computed(() => {
//   return Math.abs(lengthX.value) * (direction.value === 'LEFT' ? -1 : 1)
// })
</script>

<style lang="postcss" scoped>
.opepen-swipe {
  --action-dimension: calc(var(--size-8) + var(--size-4));

  height: 100%;
  overflow: hidden;
  display: grid;
  padding: var(--size-5) var(--size-5) var(--size-8);
  gap: 0 var(--size-9);
  align-items: center;
  grid-template-columns: 1fr 1fr;

  > .swipe {
    grid-row: 1;
    grid-column: 1 / -1;
    max-height: min(80vh, 80vw);
    width: 100%;
    max-width: min(80vh, 80vw);
    margin: 0 auto;

    .image {
      pointer-events: none;
    }
  }

  > button {
    grid-row: 2;

    &:first-of-type {
      grid-column: 1;
      justify-self: flex-end;
    }
    &:last-of-type {
      grid-column: 2;
    }
  }

  @media (--md) {
    grid-template-columns: var(--action-dimension) 1fr var(--action-dimension);
    padding: 0 0 var(--size-8);
    gap: var(--size-6);

    > .swipe {
      grid-column: 2;
    }

    > button {
      grid-row: 1;

      &:first-of-type {
        grid-column: 1;
      }
      &:last-of-type {
        grid-column: 3;
      }
    }
  }
}

/* LOADING STATES */
.opepen-swipe {

  .swipe.animated {
    transition: all var(--speed);
  }

  &.loading,
  &:has(.image:not(.loaded)) {
    .swipe > .image {
      transition: all var(--speed);
      transform: translateY(var(--size-8));
      opacity: 0;
    }

    button {
      opacity: 0 !important;
    }
  }

  &:not(.loading):has(.image.loaded) {
    .swipe > .image {
      transform: translateY(0);
      opacity: 1;
    }

    button {
      opacity: 1 !important;
    }
  }
}

button {
  width: var(--action-dimension);
  height: var(--action-dimension);
  border-radius: 50%;
  border: var(--border-dark);
  background: var(--gray-z-2);
  transition: all var(--speed-slow);
  opacity: 0.1;
  color: var(--gray-z-5);

  &:--highlight {
    color: var(--gray-z-5);
  }

  .icon {
    color: inherit !important;
    width: var(--size-6);
    height: var(--size-6);
  }

  &:last-child {
    color: var(--success);

    &:--highlight {
      color: var(--success);
    }
  }
}
</style>
