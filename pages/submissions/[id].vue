<template>
  <PageFrameSm class="submission">
    <SetPreviewImages :data="submission" class="items" />
    <SetItemsMeta :data="submission" />

    <section v-if="submission.richContentLinks?.length" class="deep-dive">
      <SectionTitle>Deep Dive</SectionTitle>
      <RichContentLinks :links="submission.richContentLinks" />
    </section>

    <SetDynamicImagesPreview
      v-if="submission.edition_type === 'DYNAMIC'"
      :data="submission"
    />

    <!-- <AdminMenuSetSubmissions v-if="submission" :submission="submission" @refresh="refresh"> -->
    <!--   <template #before> -->
    <!--     <Button  :to="`/create/sets/${submission.uuid}`"> -->
    <!--       <Icon type="edit" /> -->
    <!--       <span>Edit</span> -->
    <!--     </Button> -->
    <!--   </template> -->
    <!-- </AdminMenuSetSubmissions> -->
  </PageFrameSm>
</template>

<script setup>
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

if (isSetId(route.params.id)) await navigateTo(`/sets/${route.params.id}`)

const { data: submission, refresh } = await useFetch(`${config.public.opepenApi}/set-submissions/${route.params.id}`)

if (submission.value?.set_id) await navigateTo('/sets')

useMetaData({
  title: `${submission.value.name} | Set Submission | Opepen`,
  description: shortenedCleanText(submission.value.description),
  og: `${config.public.opepenApi}/render/sets/${submission.value.uuid}/og?${new URLSearchParams(route.query)}`,
  meta: [
    // TODO: Fix and reenable these frames
  ],
})
</script>

<style scoped>
  .submission {
    display: flex;
    flex-direction: column;
    gap: var(--spacer);
    row-gap: var(--spacer-lg);
    max-width: var(--content-width-sm);
    margin: 0 auto;

    @media (--md) {
      gap: var(--spacer-lg);
    }
  }

  .deep-dive {
    display: grid;
    gap: var(--spacer);
  }
</style>
