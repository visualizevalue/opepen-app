<template>
  <nav class="bottomnav">
    <NuxtLink to="/permanent">
      <Icon type="opepen-grid-2" />
      <span>Browse</span>
    </NuxtLink>
    <NuxtLink to="/create/set">
      <Icon type="plus" stroke-width="3" />
      <span>Submit</span>
    </NuxtLink>
    <NuxtLink to="/artists">
      <Icon type="opepen" />
      <span>Community</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.bottomnav {
  height: var(--bottomnav-height);
  width: 100vw;
  overflow: hidden;
  background: var(--semi);
  backdrop-filter: var(--blur);
  position: fixed;
  z-index: var(--z-index-nav-secondary);
  left: 0;
  bottom: 0;

  padding: var(--size-2);
  border-top: var(--border);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  justify-content: space-evenly;

  @media (--md) {
    display: none;
  }
}

a {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: var(--size-2);
  color: var(--gray-z-5);
  transition: color var(--speed);

  .icon {
    width: var(--size-5);
    height: var(--size-5);
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
