<template>
  <section>
    <NuxtLink
      v-if="address"
      to="/settings"
      title="Settings"
      class="settings"
    >
      <Icon type="more-vertical" />
    </NuxtLink>

    <Avatar :account="account" />

    <h1>
      <span>{{ name }}</span>
      <small>#{{ formatNumber(id) }}</small>
    </h1>

    <div class="stats">
      <div class="stat">
        <span>{{ stats.submissions }}</span>
        <small>Submissions</small>
      </div>
      <div class="stat">
        <span>{{ stats.opepen }}</span>
        <small>Opepen</small>
      </div>
      <div class="stat">
        <span>{{ stats.curations }}</span>
        <small>Curations</small>
      </div>
    </div>

    <Connect v-if="! address" id="main-connect" />
    <CardLink v-else :to="`/${address}`">View Profile</CardLink>
  </section>
</template>

<script setup>
const props = defineProps({
  address: String,
})

const address = computed(() => props.address)
const account = await useProfile(address)
const name = computed(() => account.value?.name || `Opepen Visitor`)
const id = computed(() => shortAddress(address.value || ADDRESS_ZERO, 3))
const stats = computed(() => ({
  submissions: formatNumber(account.value?.set_submissions_count || 0),
  curations: formatNumber(account.value?.votes_count || 0),
  opepen: formatNumber(account.value?.opepen_count || 0),
}))
</script>

<style scoped>
section {
  position: relative;
  display: grid;
  gap: var(--spacer);
}

.settings {
  position: absolute;
  top: var(--size-4);
  right: var(--size-4);
  color: var(--gray-z-5);
  transition: color var(--speed);
  z-index: 1;

  .icon {
    width: var(--size-4);
    height: var(--size-4);
  }

  &:--highlight {
    color: var(--color);
  }
}

.avatar {
  width: var(--size-7);
}

h1 {
  display: flex;
  gap: var(--spacer-sm);
  align-items: baseline;

  span {
    font-size: var(--font-lg);
    font-weight: var(--font-weight-bold);
  }

  small {
    @mixin ui-font;
    font-size: var(--font-base);
    color: var(--gray-z-5);
  }
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacer-sm);

  .stat {
    @mixin ui-font;
    display: flex;
    gap: var(--size-0);

    span,
    small {
      font-size: var(--ui-font-size);
    }

    small {
      color: var(--gray-z-5);
    }
  }
}
</style>
