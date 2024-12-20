<template>
  <p>You revealed {{ ownedRevealed.length }} Opepen<span v-if="ownedRevealed.length"> 🎉</span><span v-else>.</span></p>
  <ul v-if="ownedRevealed.length">
    <li v-for="o in ownedRevealed" :key="o.token_id">
      <NuxtLink :to="`/opepen/${o.token_id}`">
        <!--span class="icon">
          <Image :image="o.image" version="sm" />
        </span-->
        #{{ o.token_id }} <span class="muted">(1/{{ o.data.edition }})</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
const config = useRuntimeConfig()
const props = defineProps({ data: Object, subscription: Object })

const opepenUrl = `${config.public.opepenApi}/opepen/sets/${props.data?.set_id}/opepen`
const { data: revealedOpepen } = await useLazyFetch(opepenUrl, { key: 'revealed-opepen' })

const ownedRevealed = computed(() => {
  const optedIn = props.subscription?.opepen_ids || []

  if (Array.isArray(revealedOpepen.value) && optedIn.length) {
    return revealedOpepen.value.filter(o =>  optedIn.includes(o.token_id))
  }

  return []
})
</script>
