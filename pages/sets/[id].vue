<template>
  <PageFrameSm class="set">
    <SetPagination :set="set" />

    <SetPreviewImages :data="submission" />
    <SetItemsMeta :data="submission" />

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
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

definePageMeta({
  middleware (to) {
    if (! isSetId(to.params.id)) {
      return navigateTo(`/submissions/${to.params.id}`, { redirectCode: 301 })
    }
  }
})

const { data: set, refresh } = await useFetch(`${config.public.opepenApi}/opepen/sets/${route.params.id}`)
const submission = computed(() => set.value?.submission)

useMetaData({
  title: `Set ${pad(set.value.id, 3)}: ${submission.value.name || 'Unrevealed'} | Opepen`,
  description: shortenedCleanText(submission.value.description),
  og: submission.value
    ? `${config.public.opepenApi}/render/sets/${submission.value.uuid}/og?${new URLSearchParams(route.query)}`
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
