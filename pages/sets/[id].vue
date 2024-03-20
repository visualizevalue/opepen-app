<template>
  <div class="set">
    <header>
      <SetPagination v-if="isSet" :set="set" />
      <EmailNotificationAlert />
      <SetReplacementNote v-if="submission?.set_id" :set="set" :replaced-submission="set.replacedSubmission" class="note" />
    </header>

    <SetPreviewImages :data="submission" class="items" />
    <SetItemsMeta :data="submission" />

    <!-- <SetAbout :set="set" /> -->
    <SetStats :data="submission" class="stats" />
    <SetOptIn :data="submission" @update="() => refresh()" />
    <SetStatsMeta :data="submission" />

    <SetOpepen v-if="submission.set_id" :data="submission" />

    <!-- TODO: Reenable comments -->
    <!-- <SetOptInComments :data="data" /> -->

    <AdminMenu v-slot="{ setAction }">
      <Button :to="`/create/sets/${submission.uuid}`">
        <Icon type="edit" />
        <span>Edit</span>
      </Button>
      <Button @click="() => setAction(submission, 'star').then(() => refresh())">
        <Icon type="star" :fill="submission.starred_at ? 'var(--yellow)' : 'transparent'" :stroke="submission.starred_at ? 'var(--yellow)' : 'currentcolor'" />
        <span v-if="submission.starred_at">Starred</span>
        <span v-else>Star</span>
      </Button>
      <Button @click="() => setAction(submission, submission.approved_at ? 'unapprove' : 'approve').then(() => refresh())">
        <Icon type="check" :stroke="submission.approved_at ? 'var(--green)' : 'currentcolor'" />
        <span v-if="submission.approved_at">Approved</span>
        <span v-else>Approve</span>
      </Button>
    </AdminMenu>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { isSetId } from '~/helpers/urls'
import { useMetaData } from '~/helpers/head'
import pad from '~/helpers/pad'
import { shortenedCleanText } from '~/helpers/strings'

const config = useRuntimeConfig()

const route = useRoute()
const isSet = isSetId(route.params.id)

const url = isSet
  ? `${config.public.opepenApi}/opepen/sets/${route.params.id}`
  : `${config.public.opepenApi}/set-submissions/${route.params.id}`

const { data, refresh } = await useFetch(url)
const set = computed(() => isSet ? data.value : data.value.set)
const submission = computed(() => isSet ? data.value.submission : data.value)

const revealsAt = submission.value.reveals_at && DateTime.fromISO(submission.value.reveals_at).toUnixInteger()
const revealed = revealsAt && (revealsAt <= DateTime.now().toUnixInteger())
const mainButton = revealed || !submission.value.name
  ? [
    { property: 'fc:frame:button:1', content: `Set #${pad(submission.value.id, 3)} on Opepen.art` },
    { property: 'fc:frame:button:1:action', content: `link` },
    { property: 'fc:frame:button:1:target', content: `https://opepen.art/sets/${submission.value.id}` },
  ]
  : [{ property: 'fc:frame:button:1', content: 'Opt In' }]

useMetaData({
  title: `Set ${pad(submission.value.id, 3)}: ${submission.value.name || 'Locked'} | Opepen`,
  description: shortenedCleanText(submission.value.description) || `Opepen Set ${pad(submission.value.id, 3)} is one of 200 official Opepen sets.`,
  og: `${config.public.opepenApi}/frames/image/sets/${submission.value.id}?${new URLSearchParams(route.query)}`,
  meta: [
    { property: 'fc:frame', content: 'vNext' },
    { property: 'fc:frame:image', content: `https://api.opepen.art/v1/frames/sets/${submission.value.id}/detail/image` },
    { property: 'fc:frame:image:aspect_ratio', content: `1:1` },
    ...mainButton,
    { property: 'fc:frame:button:2', content: 'View 1/1 →' },
    { property: 'fc:frame:post_url', content: `https://api.opepen.art/v1/frames/sets/${submission.value.id}/detail` },
  ],
})
</script>

<style lang="postcss" scoped>
  .set {
    display: grid;
    gap: var(--size-4);
    row-gap: var(--size-7);
    max-width: var(--content-width);
    margin: 0 auto;
    grid-template-columns: 100%;
    grid-template-areas:
                "header"
                "items"
                "items-meta"
                /* "about" */
                "details"
                "details-meta"
                "opt-in"
                "opepen"
                "comments";


    @media (--md) {
      display: grid;
      gap: var(--size-7);
      row-gap: var(--size-9);
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-rows: min-content;
      grid-auto-flow: dense;
      grid-template-areas:
                  "header header"
                  "items items-meta"
                  /* "about about" */
                  "details opt-in"
                  "details-meta details-meta"
                  "opepen opepen"
                  "comments comments";
    }

    :deep() {
      > header {
        grid-area: header;
        display: flex;
        flex-direction: column;
        gap: var(--size-4);

        @media (--md) {
          gap: var(--size-7);
        }
      }
      > .items { grid-area: items; }
      > .stats { grid-area: details; }
      > .opt-in { grid-area: opt-in; }
      >.items-meta { grid-area: items-meta; }
      > .details-meta,
      > .stats-meta { grid-area: details-meta; }
      > .set-opepen { grid-area: opepen; }
      > .about { grid-area: about; }
      > .opt-in-comments { grid-area: comments; }
      > .opt-in + .opt-in-comments { grid-area: opepen; }
    }

  }

  .items,
  .stats {
    display: grid;
    aspect-ratio: 1;
  }
</style>
