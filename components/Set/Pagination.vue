<template>
  <div class="pagination">
    <NuxtLink :disabled="!previousSetId" :to="`/sets/${previousSetId}`">
      <Icon type="chevron-left" />

      <template v-if="previous">
        <span class="icon">
          <Image :image="previous.submission.edition1Image" version="sm" />
        </span>
      </template>

      <span>{{ previousSetId }}</span>
    </NuxtLink>

    <span>
      <NuxtLink to="/sets">Sets</NuxtLink>
      <span class="separator">/</span>
      <span v-if="set.submission.edition1Image" class="icon">
        <Image :image="set.submission.edition1Image" version="sm" />
      </span>
      <span>
        <span>
          {{ pad(set.id, 3) }}<span v-if="set.name" class="hidden-sm">: {{ set.name }}</span>
        </span>
      </span>
    </span>

    <NuxtLink :disabled="!nextSetId" :to="`/sets/${nextSetId}`">
      <template v-if="next">
        <span class="icon">
          <Image :image="next.submission.edition1Image" version="sm" />
        </span>
      </template>

      <span>{{ nextSetId }}</span>
      <Icon type="chevron-right" />
    </NuxtLink>
  </div>
</template>

<script setup>
import pad from '~/helpers/pad'
import { useSets } from '~/helpers/sets'

const { set } = defineProps({ set: Object })
const previousSetId = computed(() => set.id > 1 ? pad(set.id - 1, 3) : '')
const nextSetId = computed(() => set.id < 200 ? pad(set.id + 1, 3) : '')

const { nextSet, prevSet } = useSets()
const next = computed(() => nextSet(set.id))
const previous = computed(() => prevSet(set.id))
</script>

<style lang="postcss" scoped>
.pagination {
  display: grid;
  grid-template-columns: 1fr 40% 1fr;
  align-items: center;
  gap: var(--size-5);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-md);
  user-select: none;

  .separator {
    color: var(--gray-z-5);
    user-select: none;
  }

  > * {
    display: flex;
    align-items: center;
    color: var(--gray-z-8);
    font-size: var(--font-sm);
    gap: var(--size-2);
    line-height: 1;
    white-space: nowrap;

    > .icon {
      width: var(--size-5);
      height: var(--size-5);
      margin: 0 0 var(--size-0) 0;
      flex-shrink: 0;

      > .image {
        border-radius: var(--size-2);
        border-top-left-radius: var(--size-0);
      }
    }

    &:nth-child(2) {
      justify-content: center;
    }

    &:last-child {
      justify-content: flex-end;
    }

    &:first-child,
    &:last-child {
      > .icon {
        opacity: 0.5;
        transition: all var(--speed-fast);
      }

      &:--highlight {
        > .icon {
          opacity: 1;
        }
      }
    }
  }

  > a,
  > span > a {
    color: var(--gray-z-5);

    &:--highlight:not([disabled="true"]) {
      color: var(--gray-z-8);
    }

    &[disabled]:not([disabled="false"]) {
      pointer-events: none;
      cursor: disabled;
      color: var(--gray-z-4);
    }
  }
}
</style>
