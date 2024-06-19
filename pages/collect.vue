<template>
  <div class="full">
    <SecondaryNav>
      <NuxtLink to="/collect" class="exact">
        <Icon type="check" />
        <span>New Set</span>
      </NuxtLink>
      <NuxtLink to="/collect/revealed">
        <Icon type="opepen-eye" />
        <span>Revealed</span>
      </NuxtLink>
      <NuxtLink to="/collect/unrevealed">
        <Icon type="opepen" />
        <span>Unrevealed</span>
      </NuxtLink>
    </SecondaryNav>

    <NuxtPage />
  </div>
</template>

<style lang="postcss" scoped>
.full {
  display: grid;

  @media (--md) {
    padding: calc(var(--navbar-height) + var(--size-5)) var(--sidenav-width) var(--size-5) !important;
  }
}
</style>
