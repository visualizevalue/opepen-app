<template>
  <aside v-if="width >= 720">
    <TransitionGroup name="fade">
      <div
        v-for="opepen of onDisplay"
        :key="opepen.token_id"
      >
        <OpepenCard
          :token="opepen"
          :set="opepen.data.edition"
          rotate
          class="appear up"
        />
      </div>
    </TransitionGroup>
  </aside>
</template>

<script setup>
import { useIntervalFn, useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/opepen?sort=random&limit=24&includes[]=image&filter[set_id]=!null`
const { data: opepen } = await useFetch(url)

const onDisplay = ref([])

useIntervalFn(() => {
  if (! opepen.value.data.length) return

  onDisplay.value = onDisplay.value.concat(opepen.value.data.splice(0, 1))
}, 5000)
</script>

<style lang="postcss" scoped>
aside {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  padding: 20%;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    width: 60%;
    max-width: 32rem;
    margin: auto;
    position: absolute;
  }

  .opepen-card {
    position: relative;
  }
}
</style>
