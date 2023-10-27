<template>
  <article v-if="set.creator && set.artist_signature">
    <Button :to="`/holders/${set.creator}`">
      <ApiAccount
        :account="set.creatorAccount"
        :hide-address="false"
      />
    </Button>
    <Button
      :to="`https://etherscan.io/tx/${set.artist_signature.tx}`"
      target="_blank"
      class="signature"
    >
      <Icon type="feather" />
      <span>
        <span>Set Signature</span>
        <small>{{ set.artist_signature.tx }}</small>
      </span>
    </Button>
  </article>
</template>

<script setup>
const { set } = defineProps({
  set: Object,
})
</script>

<style lang="postcss" scoped>
article {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  overflow: hidden;

  > .button {
    height: calc(var(--size-8) - var(--size-1)*1.5);
    padding: 0 var(--size-4) 0;

    :deep(.avatar img) {
      height: calc(var(--size-7) + var(--size-2));
      width: calc(var(--size-7) + var(--size-2));
    }

    &:first-child {
      padding-left: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    &:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: -1px;
    }
  }

  .signature {
    justify-content: flex-start;
    max-width: 12rem;

    i {
      margin-right: var(--size-1);
    }

    span {
      width: 100%;

      &:has(small) {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
      }

      span, small {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
