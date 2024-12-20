<template>
  <div class="has-tertiary">
    <TertiaryNav>
      <NuxtLink to="/collect/buy/unrevealed">
        <Icon type="opepen-outline" />
        <span>Unrevealed</span>
      </NuxtLink>
      <NuxtLink to="/collect/buy/revealed">
        <Icon type="opepen" />
        <span>Revealed</span>
      </NuxtLink>
    </TertiaryNav>

    <NuxtPage />
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Buy Opepen',
})
</script>
