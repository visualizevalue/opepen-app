<template>
  <article class="post cast" ref="el">
    <div class="inner">
      <NuxtLink :to="authorUrl" title="Go to author">
        <Avatar :account="post.account" />
      </NuxtLink>
      <div class="content">
        <span class="meta">
          <NuxtLink :to="authorUrl" class="name">{{ post.account.display }}</NuxtLink>
          <span class="sep">·</span>
          <NuxtLink :to="`https://warpcast.com/~/conversations/${post.hash}`" class="date">{{ timeAgo(post.created_at) }} on Farcaster</NuxtLink>
        </span>

        <div v-if="post.data" class="text">
          <ExpandableText :text="text">
            <template #trigger="{toggle, expanded}">
              <span>&nbsp;</span>
              <button v-if="! expanded" class="inline" @click="toggle">Read on</button>
            </template>
          </ExpandableText>
        </div>
        <!-- <div v-if="embeds.length" class="images" :class="[`images-${embeds.length}`]">
          <Image v-for="embed in embeds" :key="embed" :image="embed" :auto-embed="false"/>
        </div> -->
        <div v-if="embeds.length" class="images" :class="[`images-${embeds.length}`]">
          <PostEmbed v-for="embed in embeds" :key="embed" :url="embed" />
        </div>
      </div>

      <menu class="post-menu">
        <template v-if="admin && !post.approved_at">
          <li>
            <button @click="$emit('approve', post)">
              <Icon type="check" />
            </button>
          </li>
          <li>
            <button @click="$emit('destroy', post)">
              <Icon type="trash" />
            </button>
          </li>
        </template>
      </menu>
    </div>
  </article>
</template>

<script setup>
import { id } from '~/helpers/accounts'
import { timeAgo } from '~/helpers/dates'
import { enforceVVReferrer } from '~/helpers/strings';

const { post, style, admin } = defineProps({
  post: Object,
  admin: Boolean,
  user: String,
  hideComments: Boolean,
})

const emit = defineEmits(['approve', 'unapprove', 'destroy'])

const authorUrl = computed(() => `/${id(post.account)}`)

const castBody = post.data.castAddBody
const embeds = castBody.embeds?.map(e => enforceVVReferrer(e.url))
const mentions = castBody.mentions

const text = computed(() => {
  const pure = castBody.text

  return pure
})

// const showMore = ref(false)
</script>

<style lang="postcss" scoped>
</style>
