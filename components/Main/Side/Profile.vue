<template>
  <section class="profile">
    <template v-if="account?.address">
      <NuxtLink :to="`/${accountId(account)}`" class="identity" @click="$emit('sendClose')">
        <Avatar :account="account" class="eye" />

        <span class="who">
          <span class="name">{{ account.display }}</span>
          <small>{{ shortAddress(account.address, 4) }}</small>
        </span>
      </NuxtLink>

      <div class="account-actions">
        <NuxtLink to="/settings" @click="$emit('sendClose')">Settings</NuxtLink>
        <button class="unstyled" @click="disconnect()">Disconnect</button>
      </div>
    </template>

    <!-- `main-connect` is the hook useSignIn() clicks to open the wallet picker. -->
    <Connect v-else class-name="main-connect primary">Connect Wallet</Connect>
  </section>
</template>

<script setup>
import { useDisconnect } from '@wagmi/vue'
import { id as accountId } from '~/utils/accounts'
defineEmits(['sendClose'])

const { disconnect } = useDisconnect()

const { account } = await useProfile()
</script>

<style scoped>
section.profile {
  display: grid;
  gap: var(--size-2);
}

.identity {
  display: flex;
  align-items: center;
  gap: var(--size-3);
  padding: var(--size-2) var(--size-3);
  border-radius: 0.625rem;
  transition: background var(--speed-fast);

  &:hover {
    background: var(--fill);
  }

  .avatar {
    width: var(--size-7);
    flex-shrink: 0;
  }

  .who {
    display: grid;
    min-width: 0;
  }

  .name {
    font-size: var(--ui-font-size);
    font-weight: var(--font-weight-medium);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    color: var(--gray-z-5);
    font-size: var(--font-xs);
    font-variant-numeric: tabular-nums;
  }
}

.account-actions {
  display: flex;
  gap: var(--size-4);
  padding: 0 var(--size-3);

  a,
  button {
    font-size: var(--font-sm);
    color: var(--gray-z-5);
    cursor: pointer;
    transition: color var(--speed);

    &:--highlight {
      color: var(--color);
    }
  }
}

:deep(.main-connect) {
  width: 100%;
  min-height: 2.5rem;
}
</style>
