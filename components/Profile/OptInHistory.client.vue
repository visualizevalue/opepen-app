<template>
  <section v-if="groupedSubmissions && groupedSubmissions.length > 0">
    <SectionTitle>Opt-In History</SectionTitle>

    <div>
      <div v-for="group in groupedSubmissions" :key="group.submissionId">
        <div
          class="event summary-row"
          :class="{ expanded: expandedSubmissions[group.submissionId] }"
          @click="toggleExpand(group.submissionId)"
        >
          <span>
            <Icon
              type="chevron-right"
              class="expand-icon"
              :class="{ rotated: expandedSubmissions[group.submissionId] }"
            />
          </span>
          <span>
            <NuxtLink
              :to="`/submissions/${group.submission?.uuid}`"
              @click.stop
              class="submission-link"
            >
              {{ group.submission?.name }}
              {{ group.submission?.set_id ? `(Set ${pad(group.submission.set_id, 3)})` : '' }}
            </NuxtLink>
          </span>
          <span>
            <span class="count-container">
              <span
                :class="{
                  'count opt-in': group.netCount > 0,
                  'count opt-out': group.netCount < 0,
                  count: group.netCount === 0,
                }"
              >
                {{ group.netCount }}
              </span>
              <span>Opt-Ins</span>
            </span>
          </span>
          <span>{{ formatDate(group.lastActivity) }}</span>
        </div>

        <transition name="expand">
          <div class="details-container" v-if="expandedSubmissions[group.submissionId]">
            <div
              v-for="subscription in group.events"
              :key="subscription.id"
              class="event detail-row"
            >
              <span></span>
              <span>
                <span class="count-container">
                  <span v-if="subscription.is_opt_in" class="count opt-in">
                    +{{ subscription.optedInCount }}
                  </span>
                  <span v-else class="count opt-out">-{{ subscription.optedOutCount }}</span>
                </span>
              </span>
              <span>{{ formatDate(subscription.created_at) }}</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  address: {
    type: String,
    required: true,
  },
})

const { data } = await useApi(`/accounts/${props.address}`)
const expandedSubmissions = reactive({})
const toggleExpand = (submissionId) => {
  expandedSubmissions[submissionId] = !expandedSubmissions[submissionId]
}
const filteredHistory = computed(() => {
  const history = data.value?.subscriptionsHistory || []

  return history.filter((subscription) => {
    const hasValidSetSubmission = !!subscription.submission?.uuid
    const hasCountChanges = subscription.optedInCount > 0 || subscription.optedOutCount > 0
    return hasValidSetSubmission && hasCountChanges
  })
})
const groupedSubmissions = computed(() => {
  const history = filteredHistory.value
  if (!history.length) return []

  const groupedBySubmission = {}

  history.forEach((subscription) => {
    const submissionId = subscription.submission.uuid

    if (!groupedBySubmission[submissionId]) {
      groupedBySubmission[submissionId] = {
        submissionId,
        submission: subscription.submission,
        events: [],
        optInCount: 0,
        optOutCount: 0,
        totalOptIns: 0,
        totalOptOuts: 0,
        lastActivity: null,
      }
    }

    groupedBySubmission[submissionId].events.push(subscription)

    if (subscription.is_opt_in) {
      groupedBySubmission[submissionId].optInCount++
      groupedBySubmission[submissionId].totalOptIns += subscription.optedInCount || 0
    } else {
      groupedBySubmission[submissionId].optOutCount++
      groupedBySubmission[submissionId].totalOptOuts += subscription.optedOutCount || 0
    }

    const activityTimestamp = new Date(subscription.created_at).getTime()
    const currentLastTimestamp = new Date(
      groupedBySubmission[submissionId].lastActivity,
    ).getTime()

    if (isNaN(currentLastTimestamp) || activityTimestamp > currentLastTimestamp) {
      groupedBySubmission[submissionId].lastActivity = subscription.created_at
      groupedBySubmission[submissionId].lastSubscription = subscription
    }
  })

  const result = Object.values(groupedBySubmission).map((group) => {
    group.netCount = group.totalOptIns - group.totalOptOuts

    group.events.sort((a, b) => {
      const timestampA = new Date(a.created_at).getTime()
      const timestampB = new Date(b.created_at).getTime()
      return timestampB - timestampA
    })

    return group
  })

  return result.sort((a, b) => {
    const timestampA = new Date(a.lastActivity).getTime()
    const timestampB = new Date(b.lastActivity).getTime()
    return timestampB - timestampA
  })
})
</script>

<style scoped>
.event {
  @mixin ui-font;
  background: var(--gray-z-1);
  display: grid;
  padding: var(--size-1) var(--size-2);
  font-size: var(--font-xs);
  border: var(--border);
  border-radius: var(--size-2);
  margin: var(--size-2) 0;
  grid-template-columns: 5% 40% 30% 25%;

  .submission-link {
    transition: color var(--speed);

    &:hover {
      color: var(--color);
    }
  }

  &.summary-row {
    cursor: pointer;
    transition: background-color var(--speed) ease;

    &:hover {
      background-color: var(--gray-z-2);
    }

    &.expanded {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      margin-bottom: 0;
      border-bottom: none;
    }
  }

  &.detail-row {
    background-color: transparent;
    border: none;
    border-radius: 0;
    margin: 0;

    grid-template-columns: 45% 20% 35%;

    &:hover {
      background-color: var(--gray-z-1);
    }
  }

  > * {
    color: var(--gray-z-6);
    display: flex;
    align-items: center;
    gap: var(--size-2);

    &:first-child {
      margin-bottom: 0;
    }

    &:last-child {
      text-align: right;
      justify-content: flex-end;
    }

    :deep(.vue-feather) {
      width: var(--size-3);
      opacity: 0.5;
    }
  }
}

.count-container {
  display: flex;
  align-items: center;
  gap: var(--size-2);
}

.count {
  min-width: var(--size-5);
  text-align: right;

  &.opt-in {
    color: var(--green-light);
  }

  &.opt-out {
    color: var(--red);
  }
}

.expand-icon {
  transition: transform var(--speed) ease;
  flex-shrink: 0;
  margin-right: var(--size-1);

  &.rotated {
    transform: rotate(90deg);
  }
}

.expand-enter-active,
.expand-leave-active {
  transition: all var(--speed) ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
}

.details-container {
  position: relative;
  overflow: hidden;
  border: var(--border);
  border-top: none;
  border-bottom-left-radius: var(--size-2);
  border-bottom-right-radius: var(--size-2);
  background-color: var(--gray-z-0);
}
</style>
