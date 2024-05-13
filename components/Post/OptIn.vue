<template>
  <article class="post cast" ref="el">
    <div class="inner">
      <NuxtLink :to="authorUrl" title="Go to author">
        <Avatar :account="account" />
      </NuxtLink>
      <div class="content">
        <span class="meta">
          <NuxtLink :to="authorUrl" class="name">{{ account.display }}</NuxtLink>
          <span class="sep">·</span>
          <span class="date">{{ timeAgo(entry.created_at) }}</span>
        </span>

        <div
          class="text"
        >Opted {{ entry.is_opt_in ? 'in' : 'out' }} {{ entry.opepen_count }} Opepen to <StyledLink
          :to="`/sets/${submission.uuid}`"
        >{{ submission.name }}</StyledLink></div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { id } from '~/helpers/accounts'
import { timeAgo } from '~/helpers/dates'

const { account, entry, submission } = defineProps({
  account: Object,
  entry: Object,
  submission: Object,
})

const authorUrl = computed(() => `/${id(account)}`)
</script>

<style lang="postcss" scoped>
</style>
