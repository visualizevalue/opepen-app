<template>
  <article
    class="comment"
  >
  <NuxtLink :to="`/holders/${post.account.address}`">
    <ApiAccount :account="post.account" class="account" />
    </NuxtLink>
    <div v-if="collapse">
      {{ text }}

      <Button @click="toggle" class="small">
        <span v-if="collapsed">Expand</span>
        <span v-else>Minimize</span>
      </Button>
    </div>
    <div v-else>{{ post.comment }}</div>
  </article>
</template>

<script setup>
const props = defineProps({
  post: Object,
})

const collapsed = ref(true)
const collapse = computed(() => props.post?.comment.length > 140)
const text = computed(() => (collapse.value && collapsed.value)
  ? props.post?.comment.substring(0, 137) + '...'
  : props.post?.comment
)

const toggle = () => collapsed.value = !collapsed.value
</script>

<style lang="postcss" scoped>
  .comment {
    border: var(--border);
    border-radius: var(--size-4);
    border-top-left-radius: var(--size-1);
    padding: var(--size-3) var(--size-4);
    width: 100%;

    .account {
      font-size: var(--font-sm);
      color: var(--gray-z-5);
      margin-bottom: var(--size-2);
    }

    button {
      margin: var(--size-3) 0 0;
    }
  }
</style>
