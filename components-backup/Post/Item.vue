<template>
  <article :style="style" class="post" ref="el">
    <div class="inner">
      <NuxtLink :to="authorUrl" title="Go to author">
        <Avatar :account="post.account" />
      </NuxtLink>
      <div class="content">
        <span class="meta">
          <NuxtLink :to="authorUrl" class="name">{{ post.account.display }}</NuxtLink>
          <span class="sep">·</span>
          <span class="date">{{ timeAgo(post.created_at) }}</span>
        </span>

        <div v-if="post.body" class="text">
          <ExpandableText :text="content.text">
            <template #trigger="{toggle, expanded}">
              <span>&nbsp;</span>
              <button v-if="! expanded" class="inline" @click="toggle">Read on</button>
            </template>
          </ExpandableText>
        </div>
        <div v-if="urls?.length" class="embeds" :class="[`embeds-${urls.length}`]">
          <PostEmbed
            v-for="url in urls"
            :key="url"
            :url="url"
            :class="{ minimal: post.images?.length }"
          />
        </div>
        <div v-if="post.images?.length" class="images" :class="[`images-${post.images.length}`]">
          <Image
            v-for="image in post.images"
            :key="image.id"
            :image="image"
            :version="image.type === 'gif' ? '' : post.images.length > 1 ? 'sm' : 'lg'"
          />
        </div>

        <PostComments
          v-if="! hideComments"
          :post="post"
          :user="user"
          :admin="admin"
          @destroy="$event => $emit('destroy', $event)"
        />
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
        <li v-if="user === post.address || (admin && post.approved_at)">
          <button @click="showMore = !showMore">
            <Icon type="more-vertical" />
          </button>
        </li>
      </menu>

      <Teleport to="body" v-if="showMore">
        <menu ref="moreMenu" class="post-menu post-more-menu" :style="{ top: `${top}px`, right: `${right - width}px` }">
          <li>
            <button @click="destroy">
              <Icon type="trash" />
              <span>Delete</span>
            </button>
          </li>
          <li v-if="admin && post.approved_at">
            <button @click="unapprove">
              <Icon type="check" />
              <span>Unapprove</span>
            </button>
          </li>
        </menu>
      </Teleport>
    </div>
  </article>
</template>

<script setup>
import { onClickOutside, useElementBounding } from '@vueuse/core'
import { id } from '~/helpers/accounts'
import { timeAgo } from '~/helpers/dates'
import { enforceVVReferrer, extractURLs } from '~/helpers/strings'

const { post, style, admin } = defineProps({
  post: Object,
  style: Object,
  admin: Boolean,
  user: String,
  hideComments: Boolean,
})

const emit = defineEmits(['approve', 'unapprove', 'destroy'])

const authorUrl = computed(() => `/${id(post.account)}`)
const content = computed(() => extractURLs(post.body))
const urls = computed(() => content.urls?.map(url => enforceVVReferrer(url)))

const showMore = ref(false)
const moreMenu = ref(null)
onClickOutside(moreMenu, _ => showMore.value = false)

const el = ref(null)
const { top, right, width } = useElementBounding(el)

const destroy = () => {
  emit('destroy', post)
  showMore.value = false
}
const unapprove = () => {
  emit('unapprove', post)
  showMore.value = false
}
</script>

<style lang="postcss">
article.post {
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
  padding: var(--spacer);
  border-bottom: var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .inner {
    width: 100%;
    display: grid;
    column-gap: var(--spacer);
    grid-template-columns: var(--size-7) 1fr;
  }

  .avatar {
    height: var(--size-7);
    width: var(--size-7);
    grid-column: 1;
  }

  .content {
    grid-column: 2;
    overflow: hidden;
  }

  .meta {
    font-size: var(--font-sm);
    color: var(--gray-z-6);
    display: flex;
    gap: var(--size-1);
    line-height: 1em;
    margin-bottom: var(--size-2);
    overflow: hidden;

    > * {
      white-space: nowrap;
    }

    > a {
      &:--highlight {
        color: var(--gray-z-8);
      }
    }
  }

  .text {
    white-space-collapse: preserve;
    word-break: break-all;

    > span {
      font-family: var(--font-family);
      font-weight: var(--font-weight-medium);
      text-transform: none;
    }

    button {
      display: inline-flex;
    }
  }

  .embeds {
    padding-top: var(--size-2);
    display: grid;
    gap: var(--spacer);
  }

  .images {
    padding-top: var(--size-2);
    display: grid;
    gap: 0;

    &.images-2,
    &.images-3 {
      .image {
        &:first-child .inner {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        &:last-child .inner {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        &:not(:first-child):not(:last-child) .inner {
          border-radius: 0;
        }
      }
    }

    &.images-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    &.images-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    &.images-4 {
      grid-template-columns: repeat(2, minmax(0, 1fr));

      .image {
        &:first-child .inner {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 0;
        }
        &:nth-child(2) .inner {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
        &:nth-child(3) .inner {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        &:last-child .inner {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }

    .image {
      width: 100%;
      border-color: var(--gray-z-1);
    }
  }
}

.post-menu {
  position: absolute;
  top: var(--spacer);
  right: var(--spacer);
  margin: 0;
  padding: 0;
  display: flex;
  gap: var(--size-3);
  z-index: 1;

  li {
    margin: 0;
    list-style: none;
    width: 100%;

    > button {
      width: 100%;
      justify-content: flex-start;
    }
  }

  &:not(.post-more-menu) li > button {
    width: var(--size-5);
    height: var(--size-5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.post-more-menu {
    position: fixed;
    z-index: 20;
    gap: 0;
    flex-direction: column;
    margin-top: calc(var(--size-7) - var(--size-1));
    margin-right: var(--size-2);
    background: var(--background);
    border: var(--border);
    border-radius: var(--size-2);
    box-shadow: var(--shadow-lg);

    > * {
      padding: var(--size-2) var(--spacer);

      &:not(:last-child) {
        border-bottom: var(--border);
      }
    }
  }
}
</style>
