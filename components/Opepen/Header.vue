<template>
  <header class="opepen-header">
    <OpepenVisual :token="opepen" :version="version" class="visual" />
    <BlurFilter :std-deviation="200" :saturate="1.618" :opacity="0.5" />

    <PageHeader>
      <PageTitle>
        <small v-if="opepen.set">
          <NuxtLink :to="`/sets/${pad(opepen.set_id)}`">Set {{ pad(opepen.set_id) }}</NuxtLink>
          <Separator />
          <span class="token-id">Opepen #{{ opepen.token_id }}</span>
        </small>
        <span>{{ title }}</span>
      </PageTitle>

      <OpepenEditionSVG v-if="!burned" :editions="[opepen.data.edition]" :stroke="9" />
    </PageHeader>
  </header>
</template>

<script setup>
const { opepen, burned = false } = defineProps({
  opepen: Object,
  burned: Boolean,
})

const version = computed(() => {
  if (opepen.image?.isAnimated) return null
  if (opepen.image?.versions['lg']) return 'lg'

  return null
})

const title = computed(() => {
  return burned
    ? opepen.name
    : opepen.set?.submission[`edition${opepen.data.edition}Name`] ||
        `Opepen #${opepen.token_id}`
})
</script>

<style scoped>
header.opepen-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacer-lg);

  h1 {
    .token-id {
      display: inline-flex;
      justify-self: flex-end;
      justify-content: flex-end;
      text-align: right;
    }

    small {
      display: flex;
      gap: var(--spacer-sm);

      span {
        color: var(--gray-z-5);
      }
    }
  }
}

.visual {
  @media (--md) {
    filter: url('#blur-and-scale');
  }
}
</style>
