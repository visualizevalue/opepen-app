<template>

  <ProfileBio :account="account" />

  <section v-if="account.richContentLinks?.length" class="known-for">
    <SectionTitle>Known For</SectionTitle>
    <RichContentLinks :links="account.richContentLinks" />
  </section>

  <section v-if="account.createdSets?.length">
    <SectionTitle>Artist For Set<template v-if="account.createdSets.length > 1">s</template></SectionTitle>

    <SetPreviews :submissions="account.createdSets" :minimal="false" />
  </section>

</template>

<script setup>
// TODO: Implement `@` prefix for user routes and the needed redirects

const props = defineProps({ account: Object })
const account = computed(() => props.account)
</script>

<style scoped>
section {
  display: grid;
  gap: var(--spacer);
}
</style>

