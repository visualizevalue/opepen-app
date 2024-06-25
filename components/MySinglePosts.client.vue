<template>
  <SinglePostsGallery v-if="session" :address="session?.address?.toLowerCase()">
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
  </SinglePostsGallery>
</template>

<script setup>
import { session } from '~/helpers/siwe'
</script>

<style lang="postcss" scoped>
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
