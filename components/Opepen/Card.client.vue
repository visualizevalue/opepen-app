<template>
  <div v-if="minimal" :class="{ 'burned-card': burned }" @mouseenter="burned && (showBurned = true)" @mouseleave="burned && (showBurned = false)">
    <Image :image="burned ? (showBurned ? token.opepen.image : token.image) : token.image" version="sm">
      <div class="meta">
        <h1>#{{ token.token_id }}</h1>
        <p>{{ subline }}</p>
      </div>

      <CardLink v-if="!selectable" :to="uri || `/opepen/${token.token_id}`">
        <span>View #{{ token.token_id }}</span>
      </CardLink>
    </Image>
  </div>

  <Card v-else class="opepen-card-full">
    <div class="wrapper">
      <Image :image="token.image" version="sm" :aspect-ratio="1" />

      <h1>
        <small>
          <span v-if="token.set_id">Set {{ pad(token.set_id, 3) }}</span>
          <span class="edition" v-if="token.data?.edition">1/{{ token.data?.edition }}</span>
        </small>
        <span>{{ opepenName || 'Unrevealed' }}</span>
      </h1>
    </div>

    <CardLink v-if="!selectable" :to="uri || `/opepen/${token.token_id}`">
      <span>View #{{ token.token_id }}</span>
    </CardLink>
  </Card>
</template>

<script setup>
const { token, uri, subline, minimal, selectable, burned } = defineProps({
  token: Object,
  uri: String,
  minimal: {
    type: Boolean,
    default: true,
  },
  subline: {
    type: String,
    default: (props) => `1/${props.token.data.edition}`,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  burned: {
    type: Boolean,
    default: false,
  },
})

const showBurned = ref(false)

const opepenName = computed(() => {
  return (
    token.metadata?.attributes?.find((a) => a.trait_type === 'Opepen')?.value ||
    token.metadata?.name // for burned opepen
  )
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
    :deep(img) {
      background: var(--background);
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
        justify-content: space-between;
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

.opepen-card-full {
  container-type: inline-size;
  position: relative;
  width: 100%;
  padding: 0;

  .wrapper {
    display: grid;
    height: 100%;
    width: 100cqw;
    overflow: hidden;
    gap: var(--spacer-xs);
    padding: var(--size-1);
  }

  h1 {
    display: grid;
    gap: var(--spacer-xs);
    padding: var(--spacer-xs);
    @mixin ui-font;
    font-size: var(--font-xs);
    font-weight: var(--ui-font-weight);
    font-family: var(--ui-font-family);
    text-transform: var(--ui-text-transform);
    letter-spacing: var(--ui-letter-spacing);
    line-height: var(--ui-line-height);
    color: var(--ui-color);
    white-space: nowrap;
    width: calc(100cqw - var(--size-1) * 2);
    overflow: hidden;

    small {
      color: var(--gray-z-6);
      font-size: var(--font-xs);
      display: flex;
      align-items: center;
      gap: var(--size-1);

      .edition {
        color: var(--ui-color);
      }
    }
  }
}

.burned-card {
  :deep(.image img) {
    transition: all 0.4s ease;
  }
}
</style>
