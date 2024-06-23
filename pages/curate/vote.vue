<template>
  <div class="vote">
    <CurateOpepen @voted="refreshKey ++" />

    <ClientOnly>
      <TertiaryNav class="hidden-sm">
        <template #default>
          <CurationStats :refresh-key="refreshKey" />
        </template>
      </TertiaryNav>
    </ClientOnly>
  </div>
</template>

<script setup>
const stats = ref(null)

const refreshKey = ref(0)
</script>

<style lang="postcss" scoped>
.vote {
  height: 100%;
  padding-top: var(--navbar-height);

  @media (--md) {
    padding-top: 0;
  }
}
</style>
