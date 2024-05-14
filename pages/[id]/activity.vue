<template>
  <div class="holder-activity">
    <PostTimeline :query="{ 'filter[address]': account.address }" />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

const props = defineProps({ account: Object })
const account = computed(() => props.account)

const config = useRuntimeConfig()

useMetaData({
  title: `${ account.value?.display } Activity | Opepen`,
  description: `Activity of ${account.value?.display}.`,
  og: `${config.public.opepenApi}/render/accounts/${account.value.address}/image`,
  meta: [
    // TODO: Fix and reenable these frames
    // { property: 'fc:frame', content: 'vNext' },
    // { property: 'fc:frame:image', content: `https://api.opepen.art/v1/frames/accounts/${account.value.address}/image` },
    // { property: 'fc:frame:post_url', content: `https://api.opepen.art/v1/frames/accounts/${account.value.address}` },
    // ...frameButtons,
  ],
})
</script>

<style lang="postcss">
.holder-activity {
  margin-top: calc(-1 * var(--section-gap));
  margin-left: auto;
  margin-right: auto;
  max-width: var(--content-width-sm);
  width: 100%;

  @media (--md) {
    border-left: var(--border);
    border-right: var(--border);
  }
}
</style>
