<template>
  <div class="full">
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

    <NuxtPage class="create-page" />
  </div>
</template>

<style lang="postcss" scoped>
.full {
  display: grid;

  @media (--md) {
    padding: calc(var(--navbar-height) + var(--size-5)) var(--sidenav-width) var(--size-5) !important;
  }

  :deep(.create-page) {
    width: 100%;
    max-width: var(--content-width);
    margin: 0 auto;
  }
}

</style>
