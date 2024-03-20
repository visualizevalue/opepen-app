<template>
  <div class="creators">
    <CreatorSignature :data="data" />
    <Button v-if="data.coCreator1Account" :to="`/holders/${data.coCreator1Account.address}`">
      <ApiAccount
        :account="data.coCreator1Account"
        :hide-address="false"
      />
    </Button>
  </div>
</template>

<script setup>
const { data } = defineProps({
  data: Object,
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
  }

  > .button,
  :deep(.button-group > .button:first-child) {
    padding-left: 0;
  }

  :deep(.button) {
    height: calc(var(--size-8) - var(--size-1)*1.5);

    .avatar img {
      height: calc(var(--size-7) + var(--size-2));
      width: calc(var(--size-7) + var(--size-2));
    }
  }
}
</style>
