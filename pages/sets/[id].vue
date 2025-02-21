<template>
  <PageFrameSm class="set">
    <SetPagination :set="set" />

    <SetPreviewImages :data="submission" />
    <SetItemsMeta :submission="submission" />

    <section v-if="submission.richContentLinks?.length" class="deep-dive">
      <SectionTitle>Deep Dive</SectionTitle>
      <RichContentLinks :links="submission.richContentLinks" />
    </section>

    <SetOpepen :data="submission" />

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
  middleware: 'enter-set',
})

const { params: { id }, query } = useRoute()

const { data: set, refresh } = await useApi(`/opepen/sets/${id}`)
const submission = computed(() => set.value?.submission)

useMetaData({
  title: `Set ${pad(set.value.id, 3)}: ${submission.value.name || 'Unrevealed'} | Opepen`,
  description: shortenedCleanText(submission.value.description),
  og: submission.value
    ? `${useApiBase()}/render/sets/${submission.value.uuid}/og?${new URLSearchParams(query)}`
    : ``,
})
</script>

<style scoped>
  .set {
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
