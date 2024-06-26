<template>
  <Authenticated #default="{ isAdmin }">
    <div v-if="isAdmin" class="full">
      <SecondaryNav>
        <NuxtLink to="/admin/sets">
          <Icon type="check" />
          <span>Sets</span>
        </NuxtLink>
        <NuxtLink to="/admin/singles">
          <Icon type="opepen" />
          <span>Singles</span>
        </NuxtLink>
      </SecondaryNav>

      <NuxtPage class="has-secondary" />
    </div>
    <div v-else class="center">
      <div>
        <h1>Restricted</h1>
        <Button to="/">Go Home</Button>
      </div>
    </div>
  </Authenticated>
</template>

<style lang="postcss" scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    display: grid;
    gap: var(--size-8);
    justify-content: center;
  }

  h1 {
    font-size: var(--font-display);
  }
}
</style>
