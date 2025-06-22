<template>
  <PageFrameSm>
    <OpepenHeader :opepen="opepen" burned />
    <OpepenMetadata :opepen="opepen" burned />
    <BurnedOpepenCard :opepen="opepen" />
    <OpepenEvents :opepen="opepen" burned />
  </PageFrameSm>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()

const { data: opepen } = await useFetch(
  `${config.public.opepenApi}/opepen/burned/${route.params.id}`,
)

useMetaData({
  title: `Burned Opepen #${route.params.id}`,
  og: `${config.public.opepenApi}/render/burned/${route.params.id}/og`,
})
</script>
