<template>
  <aside
    v-if="response?.data"
    ref="gallery"
    @mouseleave="resume"
    @mouseenter="pause"
    class="appear"
  >
    <div
      v-for="opepen of response.data"
      :key="opepen.token_id"
    >
      <OpepenDetail :opepen="opepen" />
      <NuxtLink :to="`/sets/${pad(opepen.set_id)}`">
        <span>View set {{ opepen.set.submission.name }}</span>
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup>
import { useIntervalFn, useWindowSize } from '@vueuse/core'
import pad from '~/helpers/pad'

const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/opepen?sort=random&limit=24&includes[]=image&includes[]=set&includes[]=ownerAccount&includes[]=lastEvent&filter[set_id]=!null`
const { data: response, execute } = await useFetch(url, { immediate: false })
onMounted(() => execute())

const gallery = ref()
const { width } = useWindowSize()

const up = ref(false)
const { pause, resume } = useIntervalFn(() => {
  if (width.value < 1056) return

  const maxY = document.scrollingElement.scrollHeight - document.documentElement.clientHeight
  if (window.scrollY >= maxY - 20) {
    up.value = true
  } else if (window.scrollY === 0) {
    up.value = false
  }

  window.scrollTo(0, window.scrollY + (up.value ? -1 : 1))
}, 28, { immediate: false })
watch(response, () => resume())
</script>

<style lang="postcss" scoped>
aside {
  animation-name: appear;
  animation-duration: 2s;

  > div {
    position: relative;

    > a {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      span {
        opacity: 0;
      }
    }
  }
}
</style>
