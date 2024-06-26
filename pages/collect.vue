<template>
  <div class="full">
    <SecondaryNav>
      <NuxtLink to="/collect" class="exact">
        <Icon type="check" />
        <span>New Set</span>
      </NuxtLink>
      <NuxtLink to="/collect/buy">
        <Icon type="opepen" />
        <span>Buy Opepen</span>
      </NuxtLink>
    </SecondaryNav>

    <NuxtPage />
  </div>
</template>

<style lang="postcss" scoped>
.full {
}
</style>
