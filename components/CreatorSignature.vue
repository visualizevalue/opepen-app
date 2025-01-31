<template>
  <ButtonGroup v-if="data.creator">
    <Button :to="`/${id(data.creatorAccount)}`" class="account">
      <ApiAccount
        :account="data.creatorAccount"
        :hide-address="false"
      />
    </Button>
    <Button
      v-if="data.artist_signature"
      :to="`https://etherscan.io/tx/${data.artist_signature.tx}`"
      target="_blank"
      class="signature"
    >
      <Icon type="feather" />
      <span>
        <span>Set Signature</span>
        <small>{{ data.artist_signature.tx }}</small>
      </span>
    </Button>
  </ButtonGroup>
</template>

<script setup>
const { data } = defineProps({
  data: Object,
})
</script>

<style scoped>
.account {
  :deep(.avatar) {
    width: var(--size-6) !important;
    height: var(--size-6) !important;
  }
}

.signature {
  justify-content: flex-start;

  i {
    margin-right: var(--size-1);
    color: var(--gray-z-4);
    width: var(--size-4);
    height: var(--size-4);
  }

  > span {
    width: 100%;
    display: grid;
    gap: 0;
    max-width: 9rem;

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

    small {
      color: var(--gray-z-6);
    }
  }
}
</style>
