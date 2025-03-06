<template>
  <section v-if="revealed" class="set-opepen">
    <SectionTitle>Opepen</SectionTitle>

    <Loading v-if="pending" />
    <div v-else class="list">
      <div
        v-for="token in opepen"
        :key="token.token_id"
      >
        <OpepenCard
          :token="token"
          :set="token.data?.edition || 40"
        >
          <template #subline>
            <p><span>owned by </span><NuxtLink :to="`/${token.owner}`" @click.stop="() => null"> {{ token.ownerAccount?.display }}</NuxtLink></p>
          </template>
        </OpepenCard>
      </div>
    </div>
  </section>
</template>

<script setup>
const { submission } = defineProps({
  submission: Object,
})

const revealsAt = ref(DateTime.fromISO(submission.reveals_at).toUnixInteger())
const revealed = ref(revealsAt.value <= DateTime.now().toUnixInteger() && submission.set_id)

const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/opepen/sets/${submission.set_id}/opepen`
const { data: opepen, pending } = useLazyFetch(url, { key: 'revealed-opepen' })
</script>

<style scoped>
  .set-opepen {
    display: grid;
    gap: var(--spacer);
  }

  .list {
    display: grid;
    gap: var(--spacer);
    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));

    flex-wrap: wrap;
    width: 100%;
    margin: 0 auto;

    @media (--md) {
      gap: var(--spacer);
    }

    > div {
      width: 100%;

      p {
        justify-content: flex-start !important;
        gap: 0.5em;
      }
    }
  }
</style>
