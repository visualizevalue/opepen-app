<template>
  <div>
    <PageHeader>
      <h1 class="breadcrumb">
        <NuxtLink to="./">Sets</NuxtLink>
        <span class="separator">/</span>
        <span v-if="data?.name">Update "{{ data.name }}" submission</span>
        <span v-else>Update submission</span>
      </h1>
    </PageHeader>

    <SetSubmissionForm v-if="data" @updated="data = $event" :data="data" />

    <AdminMenuSetSubmissions :submission="data" @refresh="execute" />
  </div>
</template>

<script setup>
import { useSignIn } from '~/helpers/siwe'

const config = useRuntimeConfig()
const route = useRoute()

const { session } = useSignIn()

watch(session, () => {
  execute()
})
onMounted(() => {
  if (session.value) execute()
})

const { data, execute } = await useFetch(`${config.public.opepenApi}/set-submissions/${route.params.id}`, {
  credentials: 'include',
  immediate: false
})
</script>
