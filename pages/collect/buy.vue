<template>
  <div class="has-secondary">
    <TertiaryNav>
      <NuxtLink to="/collect/buy/unrevealed">
        <Icon type="opepen" />
        <span>Unrevealed</span>
      </NuxtLink>
      <NuxtLink to="/collect/buy/revealed">
        <Icon type="opepen-eye" />
        <span>Revealed</span>
      </NuxtLink>
    </TertiaryNav>

    <NuxtPage />
  </div>
</template>

<script setup>
</script>

<style lang="postcss" scoped>
</style>
