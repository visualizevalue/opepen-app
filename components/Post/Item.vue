<template>
  <article :style="style" class="post">
    <div class="inner">
      <Avatar :account="post.account" />
      <div class="content">
        <span class="meta">
          <span class="name">{{ post.account.display }}</span>
          <span class="sep">·</span>
          <span class="date">{{ timeAgo(post.created_at) }}</span>
        </span>

        <div class="text"><ExpandableText :text="post.body" /></div>
        <div v-if="post.images?.length" class="images" :class="[`images-${post.images.length}`]">
          <Image v-for="image in post.images" :key="image.id" :image="image" />
        </div>

        <PostComments v-if="! hideComments" :post="post" />
      </div>

      <menu>
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

      <menu v-if="showMore" ref="moreMenu" class="more">
        <li>
          <button @click="$emit('destroy', post)">
            <Icon type="trash" />
            <span>Delete</span>
          </button>
        </li>
        <li v-if="admin && post.approved_at">
          <button @click="$emit('unapprove', post)">
            <Icon type="check" />
            <span>Unapprove</span>
          </button>
        </li>
      </menu>
    </div>
  </article>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core'
import { timeAgo } from '~/helpers/dates'

const { post, style, admin } = defineProps({
  post: Object,
  style: Object,
  admin: Boolean,
  user: String,
  hideComments: Boolean,
})

const emit = defineEmits(['approve', 'unapprove', 'destroy'])

const showMore = ref(false)
const moreMenu = ref(null)
onClickOutside(moreMenu, _ => showMore.value = false)
</script>

<style lang="postcss" scoped>
article.post {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: var(--spacer);
  border-bottom: var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

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
  }

  .images {
    padding-top: var(--size-2);
    display: grid;
    gap: 0;

    &.images-2,
    &.images-3 {
      :deep(.image) {
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

      :deep(.image) {
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

    :deep(.image) {
      width: 100%;
      border-color: var(--gray-z-1);
    }
  }
}

menu {
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

  &:not(.more) li > button {
    width: var(--size-5);
    height: var(--size-5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.more {
    z-index: 200;
    gap: 0;
    flex-direction: column;
    top: calc(var(--size-7) - var(--size-1));
    right: var(--size-2);
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
