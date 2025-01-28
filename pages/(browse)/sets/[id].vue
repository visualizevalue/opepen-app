<template>
  <div class="set">
    <SetPagination v-if="isSet" :set="set" />

    <SetPreviewImages :data="submission" class="items" />
    <SetItemsMeta :data="submission" />

    <!-- <section v-if="submission.richContentLinks?.length" class="deep-dive"> -->
    <!--   <SectionTitle>Deep Dive</SectionTitle> -->
    <!--   <RichContentLinks :links="submission.richContentLinks" /> -->
    <!-- </section> -->
    <!---->
    <!-- <section v-if="submission" class="opepen"> -->
    <!--   <SetOpepen v-if="submission?.set_id" :data="submission" /> -->
    <!--   <SetDynamicImagesPreview v-else-if="submission.edition_type === 'DYNAMIC'" :data="submission" /> -->
    <!-- </section> -->
    <!---->
    <!-- <AdminMenuSetSubmissions v-if="submission" :submission="submission" @refresh="refresh"> -->
    <!--   <template #before> -->
    <!--     <Button  :to="`/create/sets/${submission.uuid}`"> -->
    <!--       <Icon type="edit" /> -->
    <!--       <span>Edit</span> -->
    <!--     </Button> -->
    <!--   </template> -->
    <!-- </AdminMenuSetSubmissions> -->
  </div>
</template>

<script setup>
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
  if (!submission.value?.starred_at) return false

  return DateTime.fromISO(submission.value.starred_at) > DateTime.now().minus({ hours: OPT_IN_HOURS })
})

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

<style scoped>
  .set {
    display: flex;
    flex-direction: column;
    gap: var(--spacer);
    row-gap: var(--size-7);
    max-width: var(--content-width-sm);
    margin: 0 auto;

    @media (--md) {
      gap: var(--spacer-lg);
    }
  }

.deep-dive {
  margin-bottom: calc(-1 * var(--size-4));

  > h1:first-child {
    margin-bottom: 0;
  }
}

.items {
  display: grid;
  aspect-ratio: 1;
}
</style>
