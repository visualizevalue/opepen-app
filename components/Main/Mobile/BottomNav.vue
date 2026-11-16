<template>
  <nav class="bottom-nav" aria-label="Main">
    <NuxtLink to="/" :class="{ active: $route.path === '/' }">
      <Icon type="home" />
      <span>Home</span>
    </NuxtLink>
    <NuxtLink
      to="/sets"
      :class="{ active: ['/sets', '/submissions'].some((p) => $route.path.startsWith(p)) }"
    >
      <Icon type="opepen-grid" />
      <span>Browse</span>
    </NuxtLink>
    <NuxtLink
      to="/create"
      :class="{ active: ['/create', '/contribute'].some((p) => $route.path.startsWith(p)) }"
    >
      <Icon type="plus-circle" />
      <span>Create</span>
    </NuxtLink>
    <NuxtLink to="/artists" :class="{ active: $route.path.startsWith('/artists') }">
      <Icon type="opepen" />
      <span>Artists</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  height: var(--bottom-nav-height);
  width: 100vw;
  overflow: hidden;
  background: var(--semi);
  backdrop-filter: var(--blur);
  -webkit-backdrop-filter: var(--blur);
  position: fixed;
  z-index: var(--z-index-nav-secondary);
  left: 0;
  bottom: 0;

  padding: var(--size-1) var(--size-2) env(safe-area-inset-bottom);
  border-top: var(--border);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (--lg) {
    display: none;
  }
}

a {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--gray-z-5);
  transition: color var(--speed-fast);

  .icon {
    width: var(--size-6);
    height: var(--size-6);
  }

  span {
    font-family: var(--font-family-brand);
    font-size: 0.5625rem;
    letter-spacing: var(--label-letter-spacing);
    text-transform: uppercase;
  }

  /* Route matching is done above: "/" would otherwise stay lit everywhere. */
  &.active {
    color: var(--color);
  }
}
</style>
