<template>
<article class="opepen-pack" :style="wrapperStyle">
  <div @click="onClick">
    <CountDown :until="revealTime"></CountDown>
  </div>
</article>
</template>

<script setup>
import { getRandomArbitrary } from '~/helpers/random'
import { delay, nowInSeconds } from '~/helpers/time'

const { revealTime } = defineProps({
  revealTime: Number,
})

const rotation = ref(getRandomArbitrary(-5, 5))
const scale = ref(1)
const wrapperStyle = computed(() => ({
  transform: `rotate(${rotation.value}deg) scale(${scale.value})`,
}))

const wiggle = async () => {
  rotation.value += getRandomArbitrary(5, 10)
  scale.value = 1.05
  await delay(100)
  rotation.value -= getRandomArbitrary(10, 20)
  await delay(80)
  rotation.value += getRandomArbitrary(5, 10)
  await delay(50)
  scale.value = 1
  rotation.value = getRandomArbitrary(-5, 5)
}
const onClick = () => {
  if (revealTime && nowInSeconds() < revealTime) return wiggle()
}
</script>

<style lang="postcss" scoped>
.opepen-pack {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 150%;
  transition: all var(--speed-fast);
  transform-origin: center;

  /* Inner */
  > div {
    container-type: inline-size;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/opepen-pack-shadow.png');
    background-size: contain;
    background-position: center;

    .countdown {
      position: absolute;
      text-transform: uppercase;
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--letter-spacing-md);
      text-align: center;
      width: 100%;
      color: rgba(255, 255, 255, 0.9);
      bottom: 25%;
      bottom: 35cqw;
      font-size: 5cqw;
      user-select: none;
    }
  }
}
</style>
