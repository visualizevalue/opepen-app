<template>
  <Loading v-if="loading" />
  <PostCast
    v-else
    :post="post"
    :user="address"
  />
</template>

<script setup>
import { address } from '~/helpers/use-wagmi'

const config = useRuntimeConfig()

const { cast } = defineProps({
  cast: Object,
})

const { data: post, loading } = await useFetch(`${config.public.opepenApi}/casts/${cast.fid}/${cast.hash}`)
</script>

<style scoped>
.post.cast {
  border: var(--border);
  border-radius: var(--size-5);
  border-top-left-radius: var(--size-1);
  border-bottom-right-radius: var(--size-7);
}
</style>
