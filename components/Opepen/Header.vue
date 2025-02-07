<template>
    <header>
      <BlurFilter :std-deviation="200" :saturate="1.618" :opacity="0.4" />
      <OpepenVisual :token="opepen" :version="version" class="visual" />

      <div>
        <PageTitle>
          <small v-if="opepen.set">
            <NuxtLink :to="`/sets/${pad(opepen.set)}`">Set {{pad(opepen.set_id)}}</NuxtLink>
          </small>
          <span>{{ editionName }} <span class="muted">#{{ opepen.token_id }}</span></span>
        </PageTitle>
        <OpepenEditionSVG :edition="opepen.data.edition" :stroke="8" />
      </div>
    </header>
</template>

<script setup>
const { opepen } = defineProps({ opepen: Object, })

const version = computed(() => {
  if (opepen.image?.isAnimated) return null
  if (opepen.image?.versions['lg']) return 'lg'

  return null
})

const editionName = computed(() => {
  return opepen.set?.submission[`edition${opepen.data.edition}Name`]
})
</script>

<style scoped>
  header {
    padding-top: calc(var(--main-content-height)/2 - 50cqw - var(--size-8));
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--spacer-lg);

    > div {
      display: grid;
      align-items: center;
      grid-template-columns: 1fr var(--size-8);

      svg {
        width: calc(var(--size-7) + var(--size-2));
      }
    }
  }

  .visual {
    filter: url('#blur-and-scale');
  }
</style>

