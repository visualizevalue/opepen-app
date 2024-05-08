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
      </div>
    </div>
  </article>
</template>

<script setup>
import { timeAgo } from '~/helpers/dates'

const { post, style } = defineProps({
  post: Object,
  style: Object,
})
</script>

<style lang="postcss" scoped>
article.post {
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
    margin-bottom: var(--size-1);
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
</style>
