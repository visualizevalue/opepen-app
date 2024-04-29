<template>
  <ClientOnly>
    <WithAccount v-slot="{ isConnected, address, ens, profile }">
      <slot
        :address="address"
        :ens="ens"
        :is-connected="isConnected"
        :profile="profile"
      />
    </WithAccount>

    <template #fallback></template>
  </ClientOnly>
</template>
