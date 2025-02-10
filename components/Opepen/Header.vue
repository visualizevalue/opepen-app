<template>
    <header>
      <BlurFilter :std-deviation="200" :saturate="1.618" :opacity="0.4" />
      <OpepenVisual :token="opepen" :version="version" class="visual" />

      <div>
        <PageTitle>
          <small v-if="opepen.set">
            <NuxtLink :to="`/sets/${pad(opepen.set_id)}`">Set {{pad(opepen.set_id)}}</NuxtLink>
            <span class="token-id">Opepen #{{ opepen.token_id }}</span>
          </small>
          <span>{{ editionName }}</span>
        </PageTitle>
        <OpepenEditionSVG :edition="opepen.data.edition" :stroke="9" />
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

    h1 {
      .token-id {
        display: inline-flex;
        justify-self: flex-end;
        justify-content: flex-end;
        text-align: right;
      }
    }

    > div {
      display: grid;
      align-items: center;
      grid-template-columns: 1fr var(--size-8);
      position: relative;

      h1 {
        grid-row: 1;
        grid-column: 1/-1;

        small {
          display: flex;
          gap: var(--spacer-sm);

          span {
            color: var(--gray-z-5);
            display: flex;
            gap: var(--spacer-sm);

            &:before {
              content: '·';
            }
          }
        }
      }

      svg {
        font-size: var(--font-xl);
        width: 0.75em;
        width: 1em;
        grid-row: 1;
        grid-column: 2;
        justify-self: flex-end;
        align-self: center;

        @media (--md) {
          font-size: var(--font-xxl);
        }
      }
    }
  }

  .visual {
    filter: url('#blur-and-scale');
  }
</style>

