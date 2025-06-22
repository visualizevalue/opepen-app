<template>
  <Card class="static">
    <SectionTitle>Burned Opepen</SectionTitle>
    <div class="burned-opepen">
      <Image :image="opepen.opepen.image" />
      <div class="info">
        <NuxtLink :to="`/opepen/${opepen.opepen.token_id}`" @click.stop.prevent class="title">
          <span>Opepen #{{ opepen.opepen.token_id }}</span>
        </NuxtLink>
        <div>
          <Icon type="opepen-outline" />
          <span>{{ opepen.opepen.name }}</span>
        </div>
        <div>
          <Icon type="calendar" />
          <span>Burned on {{ formatDate(opepen.burned_at) }}</span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
const { opepen } = defineProps({
  opepen: Object,
})
</script>

<style scoped>
.static {
  gap: var(--spacer);
}

.burned-opepen {
  display: grid;
  grid-template-columns: 0.6fr 1fr;
  gap: var(--size-4);

  .info {
    display: flex;
    flex-direction: column;
    gap: var(--size-2);

    > div {
      display: flex;
      align-items: center;
      gap: var(--size-2);
    }

    :deep(.icon) {
      width: var(--size-4) !important;
      height: var(--size-4) !important;
      color: var(--gray-z-6);
    }
  }

  span {
    font-family: var(--ui-font-family);
    font-size: var(--ui-font-size);
    color: var(--gray-z-6);
    text-transform: uppercase;
  }

  .title > span {
    font-size: var(--font-lg);
    color: var(--gray-z-6);
    cursor: pointer;
    transition: color var(--speed);

    &:hover {
      color: var(--color);
    }
  }
}
</style>
