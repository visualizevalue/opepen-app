<template>
  <article class="image-detail">
    <Image :image="image" version="sm" @click="$emit('click', {image, account})" />

    <slot />

    <aside v-if="showSub" @click.stop.prevent="null">
      <p>
        <NuxtLink :to="`/${computeId(account)}`">
          <ApiAccount :account="account" hide-avatar />
        </NuxtLink>
      </p>
      <p v-if="opepen" class="muted">
        <NuxtLink :to="`/opepen/${opepen.token_id}`">{{ opepen.name }}</NuxtLink>
      </p>
      <p v-else-if="submission" class="muted">
        <NuxtLink :to="`/sets/${submission.uuid}`">{{ submission.name }}</NuxtLink>
      </p>
      <p v-else-if="post" class="muted">
        {{ post.body }}
      </p>
    </aside>
  </article>
</template>

<script setup>
import { id as computeId } from '~/helpers/accounts'

const props = defineProps({
  image: Object,
  account: {
    type: Object,
    default: props => props.image.creatorAccount,
  },
  opepen: {
    type: Object,
    default: props => props.image.cachedOpepen,
  },
  submission: {
    type: Object,
    default: props => props.image.cachedSetSubmission,
  },
  post: {
    type: Object,
    default: props => props.image.cachedPost,
  },
})

const emit = defineEmits('click')

const showSub = computed(() => !! props.account)
</script>

<style lang="postcss" scoped>
.image-detail {
  position: relative;
  border: var(--border);
  border-radius: var(--size-5);
  border-top-left-radius: var(--size-1);
  overflow: hidden;

  :deep(.image) {
    border: none;
  }

  > aside {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--semi);
    display: grid;
    gap: var(--size-1);
    border-top: var(--border);
    align-items: center;
    padding: var(--size-3) var(--size-4);
    opacity: 0;
    transition: all var(--speed);
    backdrop-filter: var(--blur);

    a {
      display: flex;
      align-items: center;
      transition: all var(--speed);

      &:--highlight {
        color: var(--color);
      }
    }

    p {
      font-size: var(--font-sm);
      line-height: 1;
      margin: 0;
    }

    p.muted {
      font-size: var(--font-xs);
    }
  }

  &:--highlight {
    > aside {
      opacity: 1;
    }
  }
}
</style>
