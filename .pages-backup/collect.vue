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
      <NuxtLink to="/opt-out">
        <Icon type="opepen-outline" />
        <span>Burn Opepen</span>
      </NuxtLink>
    </SecondaryNav>

    <NuxtPage />
  </div>
</template>

<style scoped>
.full {
}
</style>
