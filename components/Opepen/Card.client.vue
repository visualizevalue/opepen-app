<template>

  <Image
    :image="token.image"
    version="sm"
  >
    <div class="meta">
      <h1>#{{ token.token_id }}</h1>
      <p>{{ subline }}</p>
    </div>

    <CardLink :to="uri || `/opepen/${token.token_id}`"><span>View #{{ token.token_id }}</span></CardLink>
  </Image>

</template>

<script setup>
const {
  token,
  uri,
  subline,
} = defineProps({
  token: Object,
  uri: String,
  subline: {
    type: String,
    default: (props) => `1/${props.token.data.edition}`
  },
})
</script>

<style scoped>
.opepen-card {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 125%;
  overflow: hidden;

  /* Inner */
  > div {
    container-type: inline-size;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--gray-z-1);
    border: var(--border);
    border-radius: var(--border-radius);
    overflow: hidden;
    display: grid;
    grid-template-rows: 4fr 1fr;

    :deep(.image > .inner),
    :deep(.image > .image) {
      border: none !important;
      border-radius: 0;
    }
    :deep(.image) {
      border-bottom: var(--border);
    }

    img {
      border-bottom: var(--border);
    }

    .text {
      padding: 0 var(--spacer-sm);
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-transform: uppercase;
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--letter-spacing-md);
      user-select: none;
      line-height: 1;
      width: 100%;
      overflow: hidden;

      :deep(h1) {
        font-size: 6cqw;
        margin-bottom: 2cqw;

        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      :deep(p) {
        font-size: 4.5cqw;
        color: var(--gray-z-7);
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        display: flex;
        align-items: center;
        justify-content: space-between
      }
    }

    a {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.00001;
    }
  }
}
</style>
