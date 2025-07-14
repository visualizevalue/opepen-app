<template>
  <Modal v-model:open="open" class="opt-in-stats-modal" compat>
    <div class="modal-header">
      <h1>Opt-In History for Opepen #{{ opepen.token_id }}</h1>
      <div class="stats-summary">
        <span class="stat">
          <strong>{{ optInStats?.total_opt_ins || 0 }}</strong>
          Total Opt-Ins
        </span>
        <span class="stat">
          <strong>{{ optInStats?.total_live_opt_ins || 0 }}</strong>
          Live Opt-Ins
        </span>
      </div>
    </div>

    <div class="history-container">
      <div
        v-for="group in ownershipGroups"
        :key="`${group.account.address}-${group.mostRecentDate}`"
        class="account-group"
      >
        <div
          class="account-header"
          @click="toggleGroup(group)"
          :class="{ expanded: isGroupExpanded(group) }"
        >
          <NuxtLink :to="`/${id(group.account)}`" class="account-link" @click.stop>
            <Avatar :account="group.account" />
            <span class="account-name">{{ group.account.display }}</span>
          </NuxtLink>
          <div class="header-right">
            <span class="opt-in-count">
              {{ group.events.length }} opt-in{{ group.events.length > 1 ? 's' : '' }}
            </span>
            <Icon type="chevron-down" class="expand-icon" />
          </div>
        </div>
        <div v-if="isGroupExpanded(group)" class="submissions-list">
          <div
            v-for="event in group.events"
            :key="`${event.submission.uuid}-${event.created_at}`"
            class="submission-item"
          >
            <span>
              <NuxtLink :to="`/submissions/${event.submission.uuid}`" class="submission-link">
                {{ event.submission.name }}
                <span v-if="event.submission.set_id" class="set-badge">
                  (Set {{ pad(event.submission.set_id, 3) }})
                </span>
                <span v-if="event.is_live" class="live-dot"></span>
              </NuxtLink>
            </span>
            <span class="submission-date">
              {{ timeAgo(DateTime.fromISO(event.created_at)) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { DateTime } from 'luxon'

const { opepen, optInStats } = defineProps({
  opepen: Object,
  optInStats: {
    type: Object,
    default: null,
  },
})

const open = defineModel('open', { required: true })

const ownershipGroups = computed(() => {
  const events = optInStats?.opt_in_history || []
  if (!events.length) return []

  const sortedEvents = events
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const groups = []
  let currentGroup = null

  for (const event of sortedEvents) {
    const address = event.subscriber_account.address

    if (!currentGroup || currentGroup.account.address !== address) {
      if (currentGroup) groups.push(currentGroup)

      currentGroup = {
        account: event.subscriber_account,
        events: [event],
        mostRecentDate: event.created_at,
      }
    } else {
      currentGroup.events.push(event)
    }
  }

  if (currentGroup) groups.push(currentGroup)

  return groups
})

const expandedGroups = ref(new Set())

const toggleGroup = (group) => {
  const key = `${group.account.address}-${group.mostRecentDate}`
  if (expandedGroups.value.has(key)) {
    expandedGroups.value.delete(key)
  } else {
    expandedGroups.value.add(key)
  }
}

const isGroupExpanded = (group) => {
  const key = `${group.account.address}-${group.mostRecentDate}`
  return expandedGroups.value.has(key)
}
</script>

<style scoped>
.modal-header {
  margin: calc(-1 * var(--spacer)) calc(-1 * var(--spacer));
  background: var(--gray-z-0);
  margin-bottom: var(--spacer);

  h1 {
    margin: 0 0 var(--size-1) 0;
    color: var(--color);
    font-size: var(--font-lg);
  }
}

.stats-summary {
  display: flex;
  flex-direction: column;

  .stat {
    @mixin ui-font;
    font-size: var(--font-sm);
    color: var(--muted);

    strong {
      color: var(--color);
    }
  }

  @media (--md) {
    flex-direction: row;
    gap: var(--spacer-sm);
  }
}

.history-container {
  background: var(--gray-z-1);
  max-height: 500px;
  margin: 0 calc(-2 * var(--spacer)) calc(-2 * var(--spacer));
  overflow-y: auto;
}

.account-group {
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }
}

.account-header {
  @mixin ui-font;
  background: var(--gray-z-1);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: var(--size-2);
  padding: var(--size-2) var(--spacer);
  font-size: var(--font-sm);
  cursor: pointer;
  transition: background-color var(--speed);

  &:hover {
    background: var(--gray-z-2);
  }

  &.expanded {
    background: var(--gray-z-2);

    .expand-icon {
      transform: rotate(180deg);
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--size-2);
}

.opt-in-count {
  @mixin ui-font;
  color: var(--muted);
  font-size: var(--font-xs);
  background: var(--gray-z-3);
  padding: var(--size-1) var(--size-2);
  border-radius: var(--size-1);
}

.expand-icon {
  color: var(--muted);
  transition: transform var(--speed);
  width: var(--size-4);
  height: var(--size-4);
}

.submissions-list {
  background: var(--gray-z-0);
}

.submission-item {
  @mixin ui-font;
  display: grid;
  padding: var(--size-2) calc(2 * var(--spacer-sm));
  font-size: var(--font-sm);
  border-bottom: 1px solid var(--border-color);
  grid-template-columns: 100%;
  transition: background-color var(--speed);

  &:hover {
    background: var(--gray-z-1);
  }

  &:last-child {
    border-bottom: none;
  }

  > * {
    color: var(--gray-z-6);
    display: flex;
    align-items: center;
    gap: var(--size-2);

    &:last-child {
      text-align: left;
      justify-content: flex-start;
      font-size: var(--font-xs);
      color: var(--muted);
      opacity: 0.7;
    }
  }

  @media (--md) {
    grid-template-columns: 1fr auto;
    gap: 0;
    align-items: center;

    > * {
      &:last-child {
        text-align: right;
        justify-content: flex-end;
        opacity: 1;
      }
    }
  }
}

.submission-link {
  text-decoration: none;
  color: inherit;
  transition: color var(--speed);
  display: flex;
  align-items: center;

  &:hover {
    color: var(--color);
  }

  .set-badge {
    color: var(--muted);
    font-size: var(--font-xs);
    margin-left: var(--size-1);
    background: var(--gray-z-2);
    padding: var(--size-1) var(--size-2);
    border-radius: var(--size-1);
  }

  .live-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: var(--green-light);
    border-radius: 50%;
    margin-left: var(--size-1);
  }
}

.account-link {
  display: flex;
  align-items: center;
  gap: var(--size-1);
  text-decoration: none;
  color: inherit;
  transition: color var(--speed);

  &:hover {
    color: var(--color);

    .account-name {
      color: var(--color);
    }
  }

  .avatar {
    width: var(--size-5);
    height: var(--size-5);
    flex-shrink: 0;
  }

  .account-name {
    color: var(--gray-z-6);
    transition: color var(--speed);
  }
}
</style>
