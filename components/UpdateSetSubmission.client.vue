<template>
  <div>
    <PageHeader>
      <h1 class="breadcrumb">
        <NuxtLink to="./">Sets</NuxtLink>
        <span class="separator">/</span>
        <span v-if="data?.name">Update "{{ data.name }}" submission</span>
        <span v-else>Update submission</span>
      </h1>

      <SetSubmissionForm v-if="data" @updated="data = $event" :data="data" />
    </PageHeader>

    <AdminMenuSetSubmissions :submission="data" @refresh="execute" />
  </div>
</template>

<script setup>
import { useSignIn } from '~/helpers/siwe'

const config = useRuntimeConfig()
const route = useRoute()

const { session } = useSignIn()

const { data, execute } = await useFetch(`${config.public.opepenApi}/set-submissions/${route.params.id}`, {
  credentials: 'include',
  immediate: false
})

watch(session, () => {
  execute()
})
onMounted(() => {
  if (session.value) execute()
})
</script>
