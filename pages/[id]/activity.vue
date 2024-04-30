<template>
  <OptInTimelineList :account="account.address" class="holder-activity">
    <template #default="{ entry }">
      <span v-if="entry.is_opt_in">Opt-In</span>
      <span v-else>Opt-Out</span>

      <span v-if="entry.opepen_count">{{ entry.opepen_count }}</span>
      <span v-else></span>

      <span>Opepen</span>

      <NuxtLink :to="`/sets/${entry.submission.uuid}`">{{ entry.submission.name }}</NuxtLink>

      <span>{{ timeAgo(entry.created_at) }}</span>
    </template>
  </OptInTimelineList>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'
import { timeAgo } from '~/helpers/dates'

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
  margin-top: -1rem;

  > div {
    grid-template-columns: 6rem 2rem 5rem 1fr 1fr !important;
    padding: var(--size-2) 0;
  }
}
</style>
