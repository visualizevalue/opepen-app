<template>
  <SinglePostsGallery v-if="session" :address="session?.address?.toLowerCase()" :refresh-key="deleted" show-empty>
    <template #empty>
      <div class="empty">
        <p class="muted">No single posts created...</p>

        <div class="actions">
          <Button to="/create/singles/submit">
            <Icon type="plus" />
            <span>Create your first</span>
          </Button>
        </div>
      </div>
    </template>
    <template #item="{ item: post, image }">
      <ImageDetailSm
        :image="image"
        :post="post"
        version="sm"
        :aspect-ratio="1"
      >
        <template #default>
          <menu v-if="! post.deleted_at">
            <button @click="destroy(post)">
              <Icon type="trash" :style="{ color: post.deleted_at ? 'var(--red)' : 'var(--gray-z-5)' }" />
            </button>
          </menu>
        </template>
        <template #sub>
          <p class="muted">
            {{ post.body }}
          </p>
        </template>
      </ImageDetailSm>
    </template>
  </SinglePostsGallery>
</template>

<script setup>
import { DateTime } from 'luxon'
import { session } from '~/helpers/siwe'

const config = useRuntimeConfig()

const deleted = ref(0)
const destroy = async (post) => {
  if (! confirm(`Really delete ${post.body ? `"${post.body}"` : 'this image'}?`)) return
  await $fetch(`${config.public.opepenApi}/posts/${post.uuid}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  post.deleted_at = DateTime.now().toISO()
  deleted.value += 1
}
</script>

<style scoped>
.empty {
  display: grid;
  gap: var(--size-5);

  p {
    text-align: center;
  }

  .actions {
    display: flex;
    justify-content: center;
  }
}
</style>
