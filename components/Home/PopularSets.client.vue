<template>
  <section v-if="popularSubmissions.length" class="sets">
    <header>
      <SectionTitle>Popular Sets</SectionTitle>
      <Button to="/sets" class="small">
        <span>Browse more</span>
      </Button>
    </header>
    <SetCardGrid :submissions="popularSubmissions" />
  </section>
</template>

<script setup>
const { popular } = usePopularSets(8)
const { setsById } = await useSets()

// Map the volume-ranked set ids onto the sets we've already loaded.
const popularSubmissions = computed(() =>
  popular.value
    .map((p) => setsById.value[p.set_id]?.submission)
    .filter(Boolean),
)
</script>
