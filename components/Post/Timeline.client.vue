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
        <template #default="{ item: post }">

          <PostItem
            :key="post.id"
            :post="post"
            :style="{ height: post.size + 'px' }"
            :admin="isAdmin"
            :user="address"
            @approve="approve"
            @unapprove="unapprove"
            @destroy="destroy"
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

const url = `${config.public.opepenApi}/posts`
const query = computed(() => {
  return new URLSearchParams({
    limit: props.limit,
    sort: props.sort,
  }).toString()
})

const action = async (post, action, method = 'POST') => {
  await $fetch(`${config.public.opepenApi}/posts/${post.uuid}/${action}`, {
    method,
    credentials: 'include',
  })
}

const approve = async (post) => {
  await action(post, 'approve')
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
