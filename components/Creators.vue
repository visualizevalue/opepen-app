<template>
  <div class="creators">
    <CreatorSignature v-if="showSignature" :data="data" />
    <component :is="linkComponent" v-else :to="`/${id(data.creatorAccount)}`">
      <ApiAccount :account="data.creatorAccount" :hide-address="hideAddress" :hide-avatar="hideAvatar" />
    </component>

    <component :is="linkComponent" v-for="creator in coCreators" :to="`/${id(creator)}`">
      <ApiAccount :account="creator" :hide-address="hideAddress" :hide-avatar="hideAvatar" />
    </component>
  </div>
</template>

<script setup>
import Button from '@vv/components/Button.vue'

const { data, showSignature } = defineProps({
  data: Object,
  showSignature: {
    type: Boolean,
    default: true,
  },
  hideAddress: {
    type: Boolean,
    default: false,
  },
  hideAvatar: {
    type: Boolean,
    default: false,
  },
  linkComponent: {
    type: [Function, String],
    default: Button,
  },
  separator: {
    type: String,
    default: '',
  },
})

const coCreators = useCoCreators(data)
</script>

<style scoped>
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
    padding-left: var(--size-2);
  }

  :deep(.button) {
    height: calc(var(--size-8) - var(--size-1));
  }
}
</style>
