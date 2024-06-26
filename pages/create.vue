<template>
  <div class="full">
    <Authenticated>
      <SecondaryNav>
        <NuxtLink to="/create/singles">
          <Icon type="opepen" />
          <span>Singles</span>
        </NuxtLink>
        <NuxtLink to="/create/sets">
          <Icon type="opepen-grid" />
          <span>Sets</span>
        </NuxtLink>
      </SecondaryNav>

      <NuxtPage class="create-page has-tertiary" />
    </Authenticated>
  </div>
</template>

<style lang="postcss" scoped>
.full {
  :deep(.create-page > div) {
    width: 100%;
    max-width: var(--content-width);
    margin: 0 auto;

    padding: var(--size-5);

    @media (--md) {
      padding: 0;
    }
  }
}

</style>
