<template>
  <PageFrameSm class="submission">
    <SetPreviewImages :data="submission" class="items" />
    <SetItemsMeta :data="submission" />

    <SetOptInCard :submission="submission" />

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
definePageMeta({
  middleware: 'enter-submission',
})

const route = useRoute()

const { data: submission } = await useApi(`/set-submissions/${route.params.id}`)

useMetaData({
  title: `${submission.value.name} | Set Submission | Opepen`,
  description: shortenedCleanText(submission.value.description),
  og: `${useConfig('opepenApi')}/render/sets/${submission.value.uuid}/og?${new URLSearchParams(route.query)}`,
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
