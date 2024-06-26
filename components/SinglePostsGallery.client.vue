<template>
  <div>
    <slot name="before" />

    <div class="posts">
      <SinglesGallery path="posts/images" :query="query" :image-accessor="post => post.images[0]">
        <template #empty>
          <slot name="empty">
            <div class="content">
              <p class="muted">No single posts created</p>
            </div>
          </slot>
        </template>
      </SinglesGallery>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  address: String
})

const config = useRuntimeConfig()
const query = computed(() => {
  const q = new URLSearchParams()

  q.append('filter[address]', props.address)

  return q.toString()
})
</script>

<style lang="postcss" scoped>
.posts {
  margin-top: calc(var(--size-2) * -1);
  margin-left: calc(var(--size-2) * -1);
  margin-right: calc(var(--size-2) * -1);

  .content {
    margin: var(--size-2);
  }
}
</style>
