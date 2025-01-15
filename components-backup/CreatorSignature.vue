<template>
  <ButtonGroup v-if="data.creator">
    <Button :to="`/${id(data.creatorAccount)}`">
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
import { id } from '~/helpers/accounts'

const { data } = defineProps({
  data: Object,
})
</script>

<style scoped>
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
</style>
