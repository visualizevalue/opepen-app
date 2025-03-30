<template>
  <SetOpepenGrid v-if="revealed">
    <Loading v-if="pending" />
    <template v-else>
      <div class="list list-1">
        <SectionTitle>
          {{ submission[`edition1Name`] }}
          <span class="muted">(1/1)</span>
        </SectionTitle>

        <OpepenCard :token="opepen[0]" :set="1" />
      </div>

      <div v-for="edition of EDITIONS" class="list" :class="[`list-${edition}`]">
        <SectionTitle>
          {{ submission[`edition${edition}Name`] }}
          <span class="muted">(1/{{ edition }})</span>
        </SectionTitle>

        <OpepenCard v-for="token of opepenForEdition(edition)" :token="token" />
      </div>
    </template>
  </SetOpepenGrid>
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

const EDITIONS = [4, 5, 10, 20, 40]
const opepenForEdition = (edition) => opepen.value.filter((o) => o.data.edition === edition)
</script>
