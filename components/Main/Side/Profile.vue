<template>
  <section class="profile">
    <div class="identity">
      <Avatar :account="account" class="eye" />

      <h1>
        <span>{{ name }}</span>
        <!-- Without an account this is only the zero address, which reads as noise. -->
        <small v-if="account?.address">#{{ formatNumber(id) }}</small>
      </h1>
    </div>

    <!-- Exposed as rows rather than hidden behind a dropdown. -->
    <div class="account-actions">
      <template v-if="account?.address">
        <Button
          :to="`/${accountId(account)}`"
          class="link-button"
          @click="$emit('sendClose')"
        >
          <span>View Profile</span>
          <Icon type="chevron-right" />
        </Button>

        <Button to="/settings" class="link-button" @click="$emit('sendClose')">
          <span>Edit Profile</span>
          <Icon type="chevron-right" />
        </Button>

        <Button class="link-button" @click="disconnect()">
          <span>Disconnect</span>
          <Icon type="chevron-right" />
        </Button>
      </template>

      <Connect v-else class-name="main-connect link-button">
        <span>Connect</span>
        <Icon type="chevron-right" />
      </Connect>
    </div>
  </section>
</template>

<script setup>
import { useDisconnect } from '@wagmi/vue'
import { id as accountId } from '~/utils/accounts'
defineEmits(['sendClose'])

const { disconnect } = useDisconnect()

const { account } = await useProfile()
const name = computed(() =>
  !!account.value?.address ? account.value?.display : `Opepen Visitor`,
)
const id = computed(() => shortAddress(account.value?.address || ADDRESS_ZERO, 3))
</script>

<style scoped>
section.profile {
  position: relative;
  display: grid;
  gap: var(--spacer);
}


.avatar {
  width: var(--size-7);
}

/* Avatar left, name and address stacked to its right. */
.identity {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
}

h1 {
  display: grid;
  gap: var(--spacer-xs);
  min-width: 0;

  /* One treatment throughout this box: Carbon, uppercase, one size. */
  span {
    @mixin ui-font;
    font-size: var(--ui-font-size);
    font-weight: var(--font-weight-bold);
  }

  small {
    @mixin ui-font;
    font-size: var(--ui-font-size);
    color: var(--gray-z-5);
  }
}

/* Secondary to the nav proper: tighter stack, quieter colour. */
.account-actions {
  display: grid;
}

/*
 * Match the nav links: full-bleed row with the chevron pushed to the right
 * edge, rather than a chevron trailing the label.
 */
:deep(.link-button) {
  display: grid;
  grid-template-columns: 1fr var(--size-7);
  align-items: center;
  justify-items: start;
  text-align: left;
  gap: var(--spacer-sm);
  width: calc(100% + 2 * var(--spacer));
  margin-left: calc(-1 * var(--spacer));
  margin-right: calc(-1 * var(--spacer));
  padding: var(--spacer-xs) var(--spacer);
  border-radius: var(--border-radius);
  color: var(--gray-z-5);
  transition:
    background var(--speed),
    color var(--speed);

  .icon {
    justify-self: flex-end;
    width: var(--size-4);
    color: var(--gray-z-3);
  }

  &:--highlight {
    background: var(--gray-z-1);
    box-shadow: var(--border-shadow);
    color: var(--color);
  }
}

/* Signed out, connecting is the only thing to do here: make it the one accent. */
:deep(.main-connect) {
  color: var(--success);

  .icon {
    color: inherit;
  }

  &:--highlight {
    color: var(--green-light);
  }
}

</style>
