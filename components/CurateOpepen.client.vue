<template>
  <div v-if="completedVoting" class="complete">
    <p>
      <Confetti ref="confettiComponent" />
      <Icon type="opepen" style="color: var(--green);" />
    </p>
    <p>Curation complete...</p>
    <p class="muted"><small>Check back later for more art</small></p>
  </div>
  <Loading v-else-if="! data" />
  <div v-else class="opepen-swipe" :class="{ loading }">
    <Loading v-if="loading" txt="" />
    <button @click="() => voteAndAnimate(false)" :style="buttonLeftStyle"><Icon type="uncheck" /></button>
    <div
      ref="container"
      class="swipe"
      :class="{ animated: !isSwiping, [direction]: true, }"
      :style="swipeStyle"
    >
      <Image :image="data" :key="data.uuid" @loaded="imgLoaded = true" />
    </div>
    <button @click="() => voteAndAnimate(true)" :style="buttonRightStyle"><Icon type="check" /></button>
  </div>

</template>

<script setup>
import { useIntervalFn, onKeyStroke, useSwipe } from '@vueuse/core'
import { getRandomArbitrary } from '~/helpers/random';
import { isAuthenticated, useSignIn } from '~/helpers/siwe'
import { delay } from '~/helpers/time'

const config = useRuntimeConfig()
const emit = defineEmits(['voted'])

const { data, pending, refresh, status } = await useFetch(`${config.public.opepenApi}/votes/votable`, {
  credentials: 'include',
})
const completedVoting = computed(() => status.value === 'success' && !data.value)

const { signIn } = useSignIn()

const imgLoaded = ref(false)
const voting = ref(false)
const loading = computed(() => pending.value || !imgLoaded.value)

const vote = async (approve) => {
  if (! isAuthenticated.value) {
    return signIn()
  }

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

const animate = ref(null)
const voteAndAnimate = async (approve) => {
  if (animate.value !== null || loading.value) return

  animate.value = approve ? 'RIGHT' : 'LEFT'

  await Promise.all([
    vote(approve),
    delay(500),
  ])

  animate.value = null
}

// Keyboard logic
onKeyStroke('ArrowLeft', (e) => {
  if (e.repeat) return
  voteAndAnimate(false)
})
onKeyStroke('ArrowRight', (e) => {
  if (e.repeat) return
  voteAndAnimate(true)
})

// Swipe logic
const container = ref(null)
const containerWidth = computed(() => container.value?.offsetWidth)
const positionX = ref(0)
const percentage = computed(() => positionX.value / containerWidth.value)
const absPercentage = computed(() => Math.abs(percentage.value))
const rotation = computed(() => percentage.value * 10)
const { isSwiping, direction: swipeDirection, lengthX } = useSwipe(container, {
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
const direction = computed(() => animate.value || swipeDirection.value)

const swipeStyle = computed(() => {
  const x = animate.value
    ? animate.value === 'RIGHT' ? containerWidth.value/3  : -1 * containerWidth.value/3
    : positionX.value
  const rot = animate.value
    ? animate.value === 'RIGHT' ? 5 : -5
    : rotation.value
  const opacity = animate.value ? 0 : positionX === 0 ? 1 : 1 - absPercentage.value

  return {
    transform: `translateX(${x}px) rotate(${rot}deg)`,
    opacity: opacity + ' !important',
  }
})
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

const confettiComponent = ref(null)
useIntervalFn(() => {
  if (! confettiComponent.value?.confetti) return

  confettiComponent.value.confetti({
    particleCount: 2,
    spread: 80,
    startVelocity: 5,
    decay: 0.99,
    gravity: 0.5,
    colors: ['#94E337'],
    scalar: getRandomArbitrary(0.2, 2).toFixed(2),
  })
}, 50)
</script>

<style lang="postcss" scoped>
.opepen-swipe {
  --action-dimension: calc(var(--size-8) + var(--size-4));

  height: 100%;
  overflow: hidden;
  display: grid;
  padding: var(--size-5) var(--size-5) var(--size-8);
  gap: var(--size-3) var(--size-9);
  align-items: center;
  grid-template-columns: 1fr 1fr;

  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -1rem;
    margin-top: -1rem;
  }

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

  &:last-child {
    color: var(--success);
  }

  &:--highlight {
    background: var(--gray-z-3);
    color: var(--color) !important;

    &:last-child {
      color: var(--success) !important;
    }
  }

  .icon {
    color: inherit !important;
    width: var(--size-6);
    height: var(--size-6);
  }
}

.complete {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p:first-child {
    font-size: var(--font-lg);
    margin-bottom: var(--size-4);

    :deep(.icon) {
      display: block;
      width: var(--size-8);
      height: var(--size-8);
      box-shadow: 0 0 1rem 1rem var(--background);
      background: var(--background);
      border-radius: var(--size-7);
      z-index: 3000;
      position: relative;

      svg {
        position: absolute;
        top: calc(-1 * var(--size-6)/2);
        left: calc(-1 * var(--size-6)/2);
        width: calc(var(--size-8) + var(--size-6));
        height: calc(var(--size-8) + var(--size-6));
      }
    }
  }
}
</style>
