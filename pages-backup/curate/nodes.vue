<template>
  <div class="view has-tertiary">
    <TertiaryNav>
      <NuxtLink to="/curate/nodes" class="exact">
        <Icon type="infinity" />
        <span>Curators</span>
      </NuxtLink>
      <NuxtLink to="/curate/nodes/patrons">
        <Icon type="infinity-half-flower" />
        <span>Patrons</span>
      </NuxtLink>
      <NuxtLink to="/curate/nodes/artists">
        <Icon type="infinity-flower" />
        <span>Artists</span>
      </NuxtLink>
    </TertiaryNav>

    <NuxtPage class="nodes-page" />
  </div>
</template>

<style lang="postcss" scoped>
.view {
  height: 100%;

  :deep(> .view-page) {
    padding: var(--size-2);

    @media (--md) {
      padding: var(--size-3);
    }
  }

  :deep(.nodes-page) {
    padding: var(--size-5);

    @media (--md) {
      padding: var(--size-7) 0;
    }
  }
}

</style>
