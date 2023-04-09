<template>
  <article>
    <div class="inner">
      <Loading v-if="loading" />
      <template v-else>
        <img :src="image.uri" >
      </template>
    </div>
  </article>
</template>

<script setup>
import { post } from '~/api'
const config = useRuntimeConfig()

const props = defineProps({
  step: Object,
  image: Object,
})

const image = ref(props.image)
const loading = computed(() => ! image.value?.uuid)

onMounted(async () => {
  if (! image.value.uuid) {
    image.value = await post(`${config.public.opepenApi}/steps/${props.step.uuid}/dream`)
  }
})
</script>

<style lang="postcss" scoped>
article {
  overflow: hidden;
  background-color: var(--gray-z-3);
  border: 1px solid var(--gray-z-4);
  border-radius: var(--size-5);
  border-top-left-radius: var(--size-1);

  position: relative;
  height: 0;
  padding-bottom: 100%;

  .inner {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }

  img {
    transform: scale(1.025);
    width: 100%;
  }
}
</style>
