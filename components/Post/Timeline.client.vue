<template>
  <PaginatedContent
    :url="url"
    :query="query"
    class="no-scroller"
    :sync-initial="false"
  >
    <template #default="{ items }">

      <VirtualScrollDynamic
        v-if="items?.length"
        :items="withExtras(items)"
        :min-item-size="75"
      >
        <template #default="{ item }">

          <PostItem
            v-if="item.type === 'POST:INTERNAL'"
            :key="`post-${item.post.id}`"
            :post="item.post"
            :admin="isAdmin"
            :user="address"
            @approve="approve"
            @unapprove="unapprove"
            @destroy="destroy"
          />
          <PostCast
            v-else-if="item.type === 'POST:FARCASTER'"
            :key="`cast-${item.cast.id}`"
            :post="item.cast"
            :admin="isAdmin"
            :user="address"
            @approve="$event => approve($event, 'casts')"
          />
          <PostNewSubmission
            v-else-if="item.type === 'SET_SUBMISSION:PUBLISH'"
            :event="item"
          />
          <PostOptIn
            v-else-if="item.type === 'SET_SUBMISSION:OPT_IN'"
            :entry="item.subscriptionHistory"
            :submission="item.submission"
            :account="item.account"
          />

        </template>
      </VirtualScrollDynamic>

    </template>
  </PaginatedContent>
</template>

<script setup>
import { DateTime } from 'luxon'
import { isAdmin } from '~/helpers/siwe'
import { address } from '~/helpers/use-wagmi'

const props = defineProps({
  limit: {
    type: Number,
    default: 24,
  },
  extraItems: {
    type: Array,
    default: () => [],
  },
  sort: {
    type: String,
    default: '-createdAt',
  },
})

const config = useRuntimeConfig()

const url = `${config.public.opepenApi}/timeline`
const query = computed(() => {
  return new URLSearchParams({
    limit: props.limit,
    sort: props.sort,
  }).toString()
})

const action = async (post, action, type = 'posts', method = 'POST') => {
  await $fetch(`${config.public.opepenApi}/${type}/${post.uuid || post.hash}/${action}`, {
    method,
    credentials: 'include',
  })
}

const approve = async (post, type) => {
  await action(post, 'approve', type)
  post.approved_at = DateTime.now().toISO()
}
const unapprove = async (post) => {
  await action(post, 'unapprove')
  post.approved_at = null
}
const deleted = ref([])
const destroy = async (post) => {
  await action(post, '', 'DELETE')

  deleted.value.push(post.id)
}

const withExtras = items => {
  const posts = props.extraItems.concat(items)

  if (deleted.value.length) {
    return posts.filter(p => ! deleted.value.includes(p.id))
  }

  return posts
}
</script>

<style lang="postcss" scoped>

</style>
