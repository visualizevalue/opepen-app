<template>

  <ProfileBio :account="account" />

  <section v-if="account.richContentLinks?.length" class="known-for">
    <SectionTitle>Known For</SectionTitle>
    <RichContentLinks :links="account.richContentLinks" />
  </section>

  <section v-if="createdSets?.length">
    <SectionTitle>Artist For Sets</SectionTitle>
    <SetPreviews :submissions="createdSets" :minimal="false" />
  </section>

  <section v-if="createdSubmissions?.length">
    <SectionTitle>Submissions</SectionTitle>
    <SetPreviews :submissions="createdSubmissions" :minimal="false" />
  </section>

  <section v-if="account.opepen_count">
    <SectionTitle>Owned Opepen <template v-if="account.opepen_count > 12">({{ account.opepen_count }})</template></SectionTitle>

    <OpepenGrid
      :url="tokensUrl"
      :key="`${account.address}-opepen`"
      :limit="80"
    />
  </section>

  <section v-if="account.burned_opepen_count">
    <SectionTitle>Burned Opepen <template v-if="account.burned_opepen_count > 12">({{ account.burned_opepen_count }})</template></SectionTitle>

    <OpepenGrid
      :url="burnedTokensUrl"
      :key="`${account.address}-burned-opepen`"
      :limit="80"
      :subline="token => `Burned Opepen #${token.opepen.token_id}`"
    />
  </section>

</template>

<script setup>
// TODO: Implement `@` prefix for user routes and the needed redirects

const props = defineProps({ account: Object })
const account = computed(() => props.account)

const config = useRuntimeConfig()
const route = useRoute()
const url = `${config.public.opepenApi}/accounts/${account.value.address}`
const tokensUrl = `${url}/opepen`
const burnedTokensUrl = `${url}/burned`

const createdSets = computed(() => account.value.createdSets
  ? account.value.createdSets
    .filter(s => !! s.set_id)
    .sort((s1, s2) => s1.set_id > s2.set_id ? 1 : -1)
  : []
)
const createdSubmissions = computed(() => account.value.createdSets
  ? account.value.createdSets
    .filter(s => ! s.set_id)
    .sort((s1, s2) => s1.created_at > s2.created_at ? -1 : 1)
  : []
)
</script>

<style scoped>
section {
  display: grid;
  gap: var(--spacer);
}
</style>

