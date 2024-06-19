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
    </div>

    <TertiaryNav>
      <button>
        <Icon type="check" />
        <span>Opt In</span>
      </button>
      <button>
        <Icon type="infinity-flower" />
        <span>Buy Unrevealed</span>
      </button>
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
import { useMetaData } from '~/helpers/head'
import { shortenedCleanText } from '~/helpers/strings'

const config = useRuntimeConfig()

const route = useRoute()

const { data, refresh } = await useFetch(`${config.public.opepenApi}/set-submissions/curated`)

const submission = computed(() => data.value.submission)
const description = computed(() => shortenedCleanText(submission.value.description, 50))
const showDescription = ref(false)

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
</style>
