<template>
  <nav class="bottom-nav">
    <NuxtLink
      to="/sets"
      title="Browse"
      :class="{
        'router-link-active': ['/sets', '/submissions'].includes($route.path),
      }"
    >
      <Icon type="opepen-grid" />
    </NuxtLink>
    <NuxtLink to="/create" title="Submit">
      <Icon type="plus" stroke-width="3" />
    </NuxtLink>
    <NuxtLink to="/artists" title="Community">
      <Icon type="opepen" />
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
  position: fixed;
  z-index: var(--z-index-nav-secondary);
  left: 0;
  bottom: 0;

  padding: var(--spacer);
  border-top: var(--border);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: flex-start;
  justify-content: space-evenly;

  @media (--lg) {
    display: none;
  }
}

a {
  justify-self: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: var(--size-2);
  color: var(--gray-z-5);
  transition: color var(--speed);
  width: min-content;

  .icon {
    width: var(--size-7);
    height: var(--size-7);
  }

  span {
    @mixin ui-font;
    font-size: var(--font-xs);
    color: inherit;
  }

  &.router-link-active {
    color: var(--color);
  }
}
</style>
