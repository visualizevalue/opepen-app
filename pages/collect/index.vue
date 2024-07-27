<template>
  <div v-if="data" class="has-tertiary">
    <div class="submission">
      <EmailNotificationAlert />

      <header>
        <h1>
          <span v-if="! submission.set">{{ submission.name }}</span>
          <NuxtLink v-else :to="`/sets/${submission.set.id}`">{{ submission.name }} <span class="muted">(Set {{ pad(submission.set.id) }})</span></NuxtLink>
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
          <span v-if="closed && data.nextSetAt" class="nowrap">
            <span>Next set in</span>
            <CountDown :until="DateTime.fromISO(data.nextSetAt).toUnixInteger()" />
          </span>
          <SetRevealStatus v-else-if="closed" :data="submission" @update="refresh" />
          <span v-else-if="! closed">
            <CountDown :until="closesAt.toUnixInteger()" minimal />
            <span>left</span>
          </span>
        </div>
      </section>

      <SetDynamicImagesPreview v-if="submission.edition_type === 'DYNAMIC'" :data="submission" />
    </div>

    <TertiaryNav>
      <SetOptInButton v-if="!closed" :data="submission" @update="refresh" />
      <SetMarketStat v-if="submission.set_id" :id="submission.set_id" #default="{ stats }">
        <NuxtLink v-if="stats?.floorListing" :to="`https://opensea.io/collection/opepen-edition?search%5BstringTraits%5D%5B0%5D%5Bname%5D=Release&search%5BstringTraits%5D%5B0%5D%5Bvalues%5D%5B0%5D=${pad(submission.set_id)}`">
          <Icon type="opensea" />
          <span>
            <span>Buy {{ submission.name }}</span>
            <span class="hidden-sm"> ({{ formatEther(stats.floorListing.price) }} ETH)</span>
          </span>
        </NuxtLink>
      </SetMarketStat>
      <NuxtLink to="/collect/buy/unrevealed">
        <Icon type="infinity-flower" />
        <span>
          <span>Buy Unrevealed </span>
          <Stats #default="{ stats }">
            <span v-if="stats?.markets.floor.unrevealed" class="hidden-sm">({{ formatEther(stats.markets.floor.unrevealed) }} ETH)</span>
          </Stats>
        </span>
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
import { formatEther } from 'viem'
import { DateTime } from 'luxon'
import { useMetaData } from '~/helpers/head'
import { shortenedCleanText } from '~/helpers/strings'
import { useNow } from '~/helpers/time'
import pad from '~/helpers/pad'

const config = useRuntimeConfig()

const route = useRoute()
const router = useRouter()

const { data, refresh } = await useFetch(`${config.public.opepenApi}/set-submissions/curated`)
// Ensure OG works as expected
if (! route.query.s) router.replace({ query: { s: data.value.submission.uuid, ...route.query }})

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
  og: `${config.public.opepenApi}/render/sets/${route.query.s}/og?${new URLSearchParams(route.query)}`,
  meta: [
    // TODO: Add opt in frame
  ],
})
</script>

<style lang="postcss" scoped>
  .submission {
    width: 100%;
    height: 100%;
    padding: var(--size-7) var(--size-4) calc(var(--navbar-height) + var(--size-8));
    max-width: min(calc(100dvh - var(--navbar-height) * 2 - 10rem), 100%);
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
      gap: var(--size-5);

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

      > a {
        text-align: right;
        width: max-content;

        &:--highlight {
          color: var(--color);
        }
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

      @media (--xs) {
        justify-content: flex-end;
        text-align: right;
      }

      > span {
        display: flex;
        gap: 0.45em;
      }
    }
  }

  .set-opepen {
    margin-top: var(--size-4);
  }

</style>
