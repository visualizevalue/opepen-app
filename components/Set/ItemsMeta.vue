<template>
  <section class="items-meta">
    <PageHeader class="intro">
      <div>
        <PageTitle>
          <small v-if="submission.set_id">Set {{ pad(submission.set_id) }}</small>
          <small v-else>Set Submission</small>
          <span :title="name">{{ name }}</span>
        </PageTitle>

        <p v-if="submission?.description">
          <ExpandableText :text="submission.description" />
        </p>
      </div>

      <OpepenEditionSVG
        v-if="!submission.set_id"
        :muted-editions="demandExistsFor"
        :editions="demandMetFor"
        :stroke="9"
        highlight-color="var(--success)"
      />
    </PageHeader>

    <DescriptionList>
      <li class="creators">
        <Icon type="user" stroke-width="2.25" />
        <span>
          <span>Created by</span>
          <NuxtLink :to="`/${id(submission.creatorAccount)}`">
            <ApiAccount :account="submission.creatorAccount" hide-avatar hide-address />
          </NuxtLink>
          <NuxtLink
            v-for="creator in truncatedCoCreators"
            :key="creator.address"
            :to="`/${id(creator)}`"
          >
            <ApiAccount :account="creator" hide-avatar hide-address />
          </NuxtLink>
          <span v-if="showMore" class="show-more" @click="openModal">
            +{{ moreCount }} more
          </span>
          <SetCoCreators
            :submission="submission"
            :co-creators="coCreators"
            v-model:open="modalOpen"
          />
        </span>
      </li>
      <li v-if="published">
        <Icon type="calendar" stroke-width="2.25" />
        <span>Submitted on {{ formatDate(submission.published_at) }}</span>
      </li>
      <li>
        <Icon type="layers" stroke-width="2.25" />
        <span v-if="SET_TYPES[submission.edition_type]">
          {{ SET_TYPES[submission.edition_type] }} Editions
        </span>
        <span v-else>Unknown Editions</span>
      </li>
      <li v-if="revealed || revealing">
        <Icon type="opepen" />
        <span>
          {{ formatNumber(submission?.submission_stats?.opepens.total || 0) }}
          Opt-Ins
        </span>
      </li>
      <li v-if="revealed || revealing">
        <Icon type="check" />
        <span>Consensus met on {{ consensusDate }}</span>
      </li>
      <li v-if="submission.reveal_strategy">
        <Icon type="code" stroke-width="2.25" />
        <NuxtLink
          to="https://github.com/visualizevalue/opepens-metadata-api/tree/main/drops/sets"
        >
          <span>Reveal mechanism {{ submission.reveal_strategy }}</span>
        </NuxtLink>
      </li>
      <li v-if="submission.reveal_block_number">
        <Icon type="box" stroke-width="2.25" />
        <NuxtLink :to="`https://etherscan.io/block/${submission.reveal_block_number}`">
          <span>Block {{ submission.reveal_block_number }}</span>
        </NuxtLink>
      </li>
      <li v-if="submission.artist_signature">
        <Icon type="feather" />
        <NuxtLink
          :to="`https://etherscan.io/tx/${submission.artist_signature.tx}`"
          target="_blank"
        >
          Set Signature
        </NuxtLink>
      </li>
    </DescriptionList>
  </section>
</template>

<script setup lang="ts">
interface Props {
  submission: SetSubmission
}
const { submission } = defineProps<Props>()

const name = computed(() => submission?.name || 'Unrevealed')
const published = computed(() => !!submission.published_at)
const revealsAt = ref(DateTime.fromISO(submission?.reveals_at).toUnixInteger())
const revealing = ref(revealsAt.value <= DateTime.now().toUnixInteger())
const revealed = computed(() => revealing.value && submission?.reveal_block_number)
const consensusDate = computed(
  () => submission?.reveals_at && formatDate(submission?.reveals_at),
)
const coCreators = useCoCreators(submission)
const showMore = computed(() => coCreators.value.length > 3)
const truncatedCoCreators = computed(() =>
  showMore.value ? [] : coCreators.value.slice(0, 2),
)
const moreCount = computed(() => {
  return showMore.value ? coCreators.value.length - truncatedCoCreators.value.length : 0
})
// Modal
const modalOpen = ref(false)
const openModal = () => {
  modalOpen.value = true
}

const demandExistsFor = computed(() => getDemandEditions(submission))
const demandMetFor = computed(() => getDemandEditions(submission, 1))
</script>

<style scoped>
.items-meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacer-lg);

  .intro > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--size-2);

    > p {
      @mixin ui-font;
      color: var(--gray-z-6);
      line-height: var(--line-height-md);
    }
  }

  .show-more {
    cursor: pointer;
    color: var(--gray-z-6);

    &:--highlight {
      color: var(--color);
    }
  }
}

.creators {
  > span {
    display: inline-flex;
    align-items: baseline;
    > * {
      margin-right: 0.3em;
    }
  }
}
</style>
