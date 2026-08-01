<template>
  <article class="compose-page">
    <IsAuthenticated>
      <template v-if="data">
        <PageHeader>
          <SectionTitle>
            <span>Compose set</span>
            <span class="submission-name">{{ data.name }}</span>
          </SectionTitle>

          <Actions>
            <Button :to="`/create/${data.uuid}`" class="small">
              <Icon type="chevron-left" />
              <span>Edit details</span>
            </Button>
            <Button :to="`/submissions/${data.uuid}`" class="small">
              <Icon type="eye" />
              <span>View submission</span>
            </Button>
          </Actions>
        </PageHeader>

        <SetCompositionBoard v-if="canCompose" :submission="data" @updated="data = $event" />

        <Alert v-else>
          <p>This composition workspace is only available to the submission creator.</p>
        </Alert>
      </template>

      <Loading v-else />
    </IsAuthenticated>
  </article>
</template>

<script setup>
const route = useRoute()
const { data } = await useApi(`/set-submissions/${route.params.id}`)

if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Submission Not Found',
  })
}

const isCreator = computed(
  () => currentAddress.value?.toLowerCase() === data.value.creator?.toLowerCase(),
)
const canCompose = computed(
  () =>
    !data.value.set_id &&
    (!data.value.published_at || isAdmin.value) &&
    (isCreator.value || isAdmin.value),
)

useMetaData({
  title: `Compose ${data.value.name || 'Submission'} | Opepen`,
})
</script>

<style scoped>
.compose-page {
  display: grid;
  gap: var(--spacer);
  width: 100%;
  max-width: var(--content-width-wide);
  margin-right: auto;
  margin-left: auto;

  @media (--md) {
    gap: var(--spacer-lg);
    padding: var(--spacer) var(--spacer-lg);
  }
}

.submission-name {
  color: var(--muted);
}
</style>
