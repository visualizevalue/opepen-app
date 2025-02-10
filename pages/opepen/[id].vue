<template>
  <PageFrameSm>
    <OpepenHeader :opepen="opepen" />
    <OpepenMetadata :opepen="opepen" />

    <OpepenEvents :opepen="opepen" />
  </PageFrameSm>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()

const { data: opepen } = await useFetch(`${config.public.opepenApi}/opepen/${route.params.id}`)

useMetaData({
  title: `Opepen #${route.params.id}`,
  og: `${config.public.opepenApi}/render/opepen/${route.params.id}/og`,
})
</script>

