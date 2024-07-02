<template>
  <div v-if="data" class="set">
    <header>
      <!-- TODO: add Section Nav -->
      <SetPagination v-if="isSet" :set="set" />
      <EmailNotificationAlert />
      <SetReplacementNote v-if="submission?.set_id" :set="set" :replaced-submission="set.replacedSubmission" class="note" />
    </header>

    <section class="meta">
      <SetPreviewImages :data="submission" class="items" />
      <SetItemsMeta :data="submission" />
    </section>

    <section class="opepen">
      <SetOpepen v-if="submission?.set_id" :data="submission" />
      <SetDynamicImagesPreview v-else :data="submission" />
    </section>

    <AdminMenuSetSubmissions v-if="submission" :submission="submission" @refresh="refresh">
      <template #before>
        <Button  :to="`/create/sets/${submission.uuid}`">
          <Icon type="edit" />
          <span>Edit</span>
        </Button>
      </template>
    </AdminMenuSetSubmissions>
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
const router = useRouter()
const isSet = isSetId(route.params.id)

const url = isSet
  ? `${config.public.opepenApi}/opepen/sets/${route.params.id}`
  : `${config.public.opepenApi}/set-submissions/${route.params.id}`

const { data, refresh } = await useFetch(url)

if (! data.value) await navigateTo('/')

const set = computed(() => isSet ? data.value : data.value.set)
const submission = computed(() => isSet ? data.value.submission : data.value)
const curated = computed(() => {
  if (!submission.value.starred_at) return false

  return DateTime.fromISO(submission.value.starred_at) > DateTime.now().minus({ hours: 48 })
})

if (curated.value) await navigateTo('/collect')
watch(curated, async () => {
  if (curated.value) await router.replace('/collect')
})
onMounted(async () => {
  if (curated.value) await router.replace('/collect')
})

useMetaData({
  title: isSet
    ? `Set ${pad(set.value.id, 3)}: ${submission.value?.name || 'Unrevealed'} | Opepen`
    : `Set Submission: ${submission.value.name} | Opepen`,
  description: submission.value?.description
    ? shortenedCleanText(submission.value.description)
    : `Opepen Set ${pad(route.params.id, 3)} is one of 200 official Opepen sets.`,
  og: submission.value
    ? `${config.public.opepenApi}/render/sets/${submission.value.uuid}/og?${new URLSearchParams(route.query)}`
    : ``,
  meta: [
    // TODO: Fix and reenable these frames
  ],
})
</script>

<style lang="postcss" scoped>
  .set {
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
    row-gap: var(--size-7);
    max-width: var(--content-width);
    margin: 0 auto;

    @media (--md) {
      gap: var(--size-8);
    }

    > header {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--size-4);
      padding: var(--size-5) 0;

      @media (--md) {
        gap: var(--size-7);
      }
    }

    > section.meta {
      display: grid;
      gap: var(--size-4);

      @media (--md) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--size-7);
      }
    }

  }

  .items {
    display: grid;
    aspect-ratio: 1;
  }
</style>
