<template>
  <div class="opepen-detail">
    <OpepenPage v-if="isOpepenToken" />
    <AiImagePage v-else />
  </div>
</template>

<script setup>
const route = useRoute()
const isOpepenToken = ! isNaN(route.params.id)
</script>

<style lang="postcss">
div.opepen-detail {
  max-width: min(80vh, 100vw);
  width: 100%;
  margin: 0 auto;

  > header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      flex-shrink: 1;
      padding-right: var(--size-4);
    }

    h1 a {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .icon,
      .vue-feather {
        flex-shrink: 0;
      }
    }

    > nav {
      display: flex;
      flex-shrink: 0;
      gap: var(--size-4);
    }
  }

  .image-wrapper {
    margin: var(--size-4) auto;
  }
}
</style>
