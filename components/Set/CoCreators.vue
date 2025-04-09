<template>
  <Modal v-model:open="open" class="co-creator-modal extra-wide" compat>
    <h1>{{ submission.name }} Co-Creators</h1>
    <ul>
      <li v-for="creator in coCreators" :key="creator.address">
        <NuxtLink :to="`/${id(creator)}`">
          {{ creator.display }}
        </NuxtLink>
      </li>
    </ul>
  </Modal>
</template>

<script setup lang="ts">
const { submission, coCreators } = defineProps<{
  submission: SetSubmission
  coCreators: any[]
}>()

const open = defineModel('open', { required: true })
</script>

<style scoped>
.co-creator-modal {
  display: grid;
  gap: var(--spacer-sm);

  li {
    @mixin ui-font;
    line-height: var(--line-height-md);
    display: inline;
    color: var(--gray-z-6);

    &:after {
      content: ', ';
    }

    a {
      transition: all var(--speed);

      &:--highlight {
        color: var(--color);
      }
    }
  }
}
</style>
