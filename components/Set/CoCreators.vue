<template>
  <Modal v-model:open="open" class="co-creator-modal extra-wide" compat>
    <PageHeader>
      <PageTitle>
        <small>All Co-Creators</small>
      </PageTitle>
    </PageHeader>

    <div class="co-creator-list">
      <template v-for="(creator, i) in coCreators" :key="i">
        <span class="co-creator">
          <NuxtLink :to="`/${id(creator)}`">
            <ApiAccount :account="creator" hide-address hide-avatar />
          </NuxtLink>
          <template v-if="i < coCreators.length - 1">,</template>
        </span>
      </template>
    </div>
  </Modal>
</template>

<script setup lang="ts">
const { coCreators } = defineProps<{
  coCreators: any[]
}>()

const open = defineModel('open', { required: true })
</script>

<style scoped>
.cocreator-modal {
  padding: 0 !important;
}
.co-creator-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-1);

  > .co-creator {
    white-space: nowrap;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    transition: all var(--speed);
    @mixin ui-font;
    color: var(--gray-z-6);

    &:--highlight {
      color: var(--color);
    }
  }
}
</style>
