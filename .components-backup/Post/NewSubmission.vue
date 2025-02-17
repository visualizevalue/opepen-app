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
          <span class="date">{{ timeAgo(event.created_at) }}</span>
        </span>

        <div class="text">
          <span>New Set Submission: <StyledLink :to="`/sets/${submission.uuid}`">{{ submission.name }}</StyledLink></span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { id } from '~/helpers/accounts'
import { timeAgo } from '~/helpers/dates'

const { event } = defineProps({
  event: Object,
})

const account = event.account
const submission = event.submission

const authorUrl = computed(() => `/${id(account)}`)
</script>

<style scoped>
</style>
