<template>
  <div class="full">
    <SecondaryNav>
      <NuxtLink to="/curate/vote">
        <Icon type="check" />
        <span>Vote</span>
      </NuxtLink>
      <NuxtLink to="/curate/view">
        <Icon type="opepen-eye" />
        <span>View</span>
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
