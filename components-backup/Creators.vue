<template>
  <div class="creators">
    <CreatorSignature v-if="showSignature" :data="data" />
    <Button v-else :to="`/${id(data.creatorAccount)}`">
      <ApiAccount :account="data.creatorAccount" :hide-address="false" />
    </Button>

    <Button v-for="creator in coCreators" :to="`/${id(creator)}`">
      <ApiAccount :account="creator" :hide-address="false" />
    </Button>
  </div>
</template>

<script setup>
import { id } from '~/helpers/accounts'

const { data, showSignature } = defineProps({
  data: Object,
  showSignature: {
    type: Boolean,
    default: true,
  }
})

const coCreators = computed(() => {
  return [
    data.coCreator1Account,
    data.coCreator2Account,
    data.coCreator3Account,
    data.coCreator4Account,
    data.coCreator5Account,
  ].filter(c => !!c)
})
</script>

<style lang="postcss" scoped>
.creators {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--size-4);

  > * {
    width: auto;
    min-width: 0;
  }

  > .button,
  :deep(.button-group > .button:first-child) {
    padding-left: 0;
  }

  :deep(.button) {
    height: calc(var(--size-8) - var(--size-1)*1.5);

    .avatar {
      height: calc(var(--size-7) + var(--size-2));
      width: calc(var(--size-7) + var(--size-2));
    }
  }
}
</style>
