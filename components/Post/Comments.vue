<template>
  <aside class="comments">
    <h1>
      <Icon type="message-circle" />
      <button @click="loadComments = true"
      >{{ post.commentsCount }} Comment<template v-if="post.commentsCount !== 1">s</template></button>
      <template v-if="! writeComment">
        <span class="sep">·</span>
        <button @click="writeComment = true; loadComments = true" class="small">Write new...</button>
      </template>
    </h1>

    <PostWriteComment v-if="writeComment" :parent="post" @created="() => refreshKey++" />

    <PaginatedContent
      v-if="loadComments"
      :url="commentsUrl"
      :query="commentsQuery"
      :refresh-key="refreshKey"
    >
      <template #default="{ items: comments }">
        <PostItem
          v-for="comment in comments"
          :key="comment.id"
          :post="comment"
          hide-comments
        />
      </template>
    </PaginatedContent>
  </aside>
</template>

<script setup>
const { post } = defineProps({
  post: Object,
})
const config = useRuntimeConfig()
const writeComment = ref(false)
const loadComments = ref(false)
const commentsUrl = `${config.public.opepenApi}/posts`
const commentsQuery = computed(() => {
  return new URLSearchParams({
    limit: 24,
    [`filter[parent_post_id]`]: post.id,
    sort: '-createdAt',
  }).toString()
})
const refreshKey = ref(0)
watch(refreshKey, () => {
  post.commentsCount += 1
})
</script>

<style lang="postcss" scoped>
.comments {
  margin-top: var(--size-3);
  position: relative;

  > h1 {
    display: flex;
    align-items: center;
    gap: var(--size-2);
    color: var(--gray-z-6);
    margin-bottom: var(--size-1);
    font-size: var(--font-sm);

    .icon {
      width: var(--size-4);
    }
  }

  :deep(.post) {
    padding: var(--size-3) 0;

    &:last-child {
      border-bottom: 0;
    }

    .inner {
      grid-template-columns: var(--size-5) 1fr;
    }

    .avatar {
      height: var(--size-5);
      width: var(--size-5);
    }

    .meta {
      margin-bottom: var(--size-1);
    }

    .text {
      font-size: var(--font-sm);
    }
  }
}
</style>
