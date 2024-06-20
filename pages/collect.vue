<template>
  <div class="full">
    <SecondaryNav>
      <NuxtLink to="/collect" class="exact">
        <Icon type="check" />
        <span>New Set</span>
      </NuxtLink>
      <NuxtLink to="/collect/buy">
        <Icon type="opepen-eye" />
        <span>Buy Opepen</span>
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
