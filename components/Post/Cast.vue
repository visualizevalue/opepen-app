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
        <div v-if="urlEmbeds.length" class="embeds" :class="[`images-${urlEmbeds.length}`]">
          <PostEmbed v-for="embed in urlEmbeds" :key="embed" :url="embed" :class="urlEmbeds.length > 1 ? `minimal` : ''" />
        </div>

        <div v-if="castEmbeds.length" class="cast-embeds">
          <PostCastEmbed
            v-for="{ castId } in castEmbeds"
            :cast="castId"
            :key="castId.hash" />
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
import { enforceVVReferrer } from '~/helpers/strings'

const { post, style, admin } = defineProps({
  post: Object,
  admin: Boolean,
  user: String,
  hideComments: Boolean,
})

const emit = defineEmits(['approve', 'unapprove', 'destroy'])

const authorUrl = computed(() => `/${id(post.account)}`)

const castBody = post.data.castAddBody
const urlEmbeds = castBody.embeds
  ?.filter(e => typeof e.url === 'string')
  ?.map(e => enforceVVReferrer(e.url))

const castEmbeds = castBody.embeds
  ?.filter(e => typeof e.castId?.hash === 'string')

const mentions = castBody.mentions

const text = computed(() => {
  const pure = castBody.text

  return pure
})

// const showMore = ref(false)
</script>

<style lang="postcss" scoped>
.embeds {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  > * {
    grid-column: 1 / -1;
  }

  > .image + .image,
  > .image:has(+ .image) {
    grid-column: span 1;
  }
}

.cast-embeds {
  margin: var(--spacer) 0 0;
}
</style>
