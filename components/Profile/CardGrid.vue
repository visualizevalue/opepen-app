<template>
  <div class="grid">
    <slot>
      <ProfileCard
        v-for="account in accounts"
        :account="account"
        :key="account.address"
        :minimal="minimal"
      />
    </slot>
  </div>
</template>

<script setup>
defineProps({
  accounts: Array,
  minimal: Boolean,
})
</script>

<style scoped>
.grid {
  --min-column-width: 14rem;

  @media (--md) {
    --min-column-width: 16rem;
  }

  display: grid;
  gap: var(--spacer);
  grid-template-columns: repeat(auto-fill, minmax(var(--min-column-width), 1fr));

  article {
    width: 100%;
  }
}
</style>
