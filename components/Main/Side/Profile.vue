<template>
  <section class="profile">
    <MainOptionsDropdown v-if="account" @sendClose="$emit('sendClose')" />

    <Avatar :account="account" class="eye" />

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
        <small>Votes</small>
      </div>
    </div>

    <Button
      v-if="account?.address"
      :to="`/${accountId(account)}`"
      class="link-button"
      @click="$emit('sendClose')"
    >
      <span>View Profile</span>
      <Icon type="chevron-right" />
    </Button>
    <Connect v-else class-name="main-connect link-button">
      <span>Connect</span>
      <Icon type="chevron-right" />
    </Connect>
  </section>
</template>

<script setup>
import { id as accountId } from '~/utils/accounts'
defineEmits(['sendClose'])

const { account } = await useProfile()
const name = computed(() =>
  !!account.value?.address ? account.value?.display : `Opepen Visitor`,
)
const id = computed(() => shortAddress(account.value?.address || ADDRESS_ZERO, 3))
const stats = computed(() => ({
  submissions: formatNumber(account.value?.set_submissions_count || 0),
  curations: formatNumber(account.value?.opt_in_count || 0),
  opepen: formatNumber(account.value?.opepen_count || 0),
}))
</script>

<style scoped>
section.profile {
  position: relative;
  display: grid;
  gap: var(--spacer);
}

:deep(.settings) {
  position: absolute;
  top: var(--size-4);
  right: var(--size-4);
  top: var(--size-2);
  right: 0;
  color: var(--gray-z-5);
  transition: color var(--speed);
  z-index: 1;
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
