<template>
  <div class="view has-tertiary">
    <TertiaryNav>
      <NuxtLink to="/curate/view/mine">
        <Icon type="infinity" />
        <span>Personal</span>
      </NuxtLink>
      <NuxtLink to="/curate/view/all">
        <Icon type="infinity-half-flower" />
        <span>Community</span>
      </NuxtLink>
      <NuxtLink to="/curate/view/permanent">
        <Icon type="infinity-flower" />
        <span>Permanent</span>
      </NuxtLink>
    </TertiaryNav>

    <NuxtPage class="view-page" />
  </div>
</template>

<style scoped>
.view {
  height: 100%;

  :deep(> .view-page) {
    padding: var(--size-4);
  }
}
</style>
