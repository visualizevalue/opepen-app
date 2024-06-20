<template>
  <div v-if="data" class="has-tertiary">
    <div class="submission">
      <EmailNotificationAlert />

      <header>
        <h1>
          <span>{{ submission.name }}</span>
          <small @click="showDescription = true" :class="{ clickable: description !== submission.description }">
            {{ description }}
          </small>
          <Modal :open="showDescription" @close="showDescription = false" modalClasses="detail-description">
            <h1>{{ submission.name }}</h1>
            <div>
              {{ submission.description }}
            </div>
          </Modal>
        </h1>

        <AccountLink :account="submission.creatorAccount" hide-avatar />
      </header>

      <SetPreviewImages :data="submission" class="items" />

      <section class="demand">
        <SetSimpleDemand :data="submission" />

        <div class="timer muted">
          <span v-if="submission.set && data.nextSetAt" class="nowrap">
            <span>Next set in</span>
            <CountDown :until="DateTime.fromISO(data.nextSetAt).toUnixInteger()" />
          </span>
          <span v-else-if="closed && submission.reveal_block_number && !submission.set">
            Revealing...
          </span>
          <span v-else>
            <CountDown :until="closesAt.toUnixInteger()" minimal />
            <span>left</span>
          </span>
        </div>
      </section>
    </div>

    <TertiaryNav>
      <SetOptInButton :data="submission" />
      <NuxtLink to="/collect/buy/unrevealed">
        <Icon type="infinity-flower" />
        <span>Buy Unrevealed</span>
      </NuxtLink>
    </TertiaryNav>

    <!-- <SetItemsMeta :data="submission" />

    <template v-if="submission?.approved_at">
      <SetStats :data="submission" class="stats" />
      <SetOptIn :data="submission" @update="() => refresh()" />
      <SetStatsMeta :data="submission" />

      <SetOpepen v-if="submission.set_id" :data="submission" />
      <SetDynamicImagesPreview v-else :data="submission" />
    </template> -->

    <!-- <AdminMenuSetSubmissions v-if="submission" :submission="submission" @refresh="refresh" class="horizontal">
      <template #before>
        <Button  :to="`/create/sets/${submission.uuid}`">
          <Icon type="edit" />
          <span>Edit</span>
        </Button>
      </template>
    </AdminMenuSetSubmissions> -->
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { useMetaData } from '~/helpers/head'
import { shortenedCleanText } from '~/helpers/strings'
import { formatDate } from '~/helpers/dates'
import { useNow } from '~/helpers/time'

const config = useRuntimeConfig()

const route = useRoute()

const { data, refresh } = await useFetch(`${config.public.opepenApi}/set-submissions/curated`)

const submission = computed(() => data.value.submission)
const description = computed(() => shortenedCleanText(submission.value.description, 50))
const showDescription = ref(false)

const now = useNow()
const closesAt = computed(() => submission.value.reveals_at
  ? DateTime.fromISO(submission.value.reveals_at)
  : DateTime.fromISO(submission.value.starred_at).plus({ hours: 48 })
)
const closed = computed(() => DateTime.fromSeconds(now.value) > closesAt.value)


useMetaData({
  title: `Collect Opepen`,
  meta: [
    // TODO: Add opt in frame
  ],
})
</script>

<style lang="postcss" scoped>
  .submission {
    width: 100%;
    height: 100%;
    padding: var(--size-7) var(--size-4) var(--size-8);
    max-width: var(--content-width-sm);
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    gap: var(--size-7);

    @media (--md) {
      justify-content: center;
    }

    > header {
      display: flex;
      color: var(--gray-z-6);
      justify-content: space-between;

      > h1 {
        display: flex;
        flex-direction: column;
        gap: var(--size-1);

        > * {
          line-height: 1;
        }

        small {
          color: var(--gray-z-5);

          &.clickable {
            cursor: pointer;
          }
        }
      }

      > a:--highlight {
        color: var(--color);
      }
    }
  }

  .detail-description {
    h1 {
      font-size: var(--font-lg);
      margin-bottom: var(--size-4);
    }
    h1 + div {
      font-family: var(--font-family-body);
      font-weight: var(--font-weight-medium);
      white-space: pre-wrap;
      font-size: var(--font-base);
      text-transform: none;
      color: var(--gray-z-8);
    }
  }

  .demand {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--size-0);

    @media (--xs) {
      flex-direction: row;
      align-items: center;
    }

    .timer {
      display: flex;

      > span {
        display: flex;
        gap: 0.45em;
      }
    }
  }

</style>
