<template>
  <div>
    <Loading />
  </div>
</template>

<script setup>
const config = useRuntimeConfig()

const create = async () => {
  const generative = await $fetch(`${config.public.opepenApi}/generative`, {
    method: 'POST',
    credentials: 'include',
    body: {
      type: 'p5',
      code : '',
    }
  })

  await navigateTo(`/editor/${generative.id}`)
}

create()
</script>
