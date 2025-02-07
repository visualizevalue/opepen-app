<template>
  <section>
    <DescriptionList>
      <li v-if="submission">
        <Icon type="opepen" stroke-width="2.25" />
        <NuxtLink :to="`/${submission.creator}`">
          Created by {{ submission.artist }}
        </NuxtLink>
      </li>
      <li>
        <Icon type="user" stroke-width="2.25" />
        <NuxtLink :to="`/${id(opepen.ownerAccount)}`">
          Owned by <ApiAccount :account="opepen.ownerAccount" hide-avatar hide-address />
        </NuxtLink>
      </li>
      <li>
        <Icon type="opepen-grid" />
        <NuxtLink v-if="submission" :to="`/sets/${pad(submission.set_id)}`">Set "{{ submission.name }}",</NuxtLink>
        <span>Edition 1 of {{ opepen.data.edition }}</span>
      </li>
      <li v-if="submission">
        <Icon type="calendar" stroke-width="2.25" />
        <span>Consensus met on {{ formatDate(submission.reveals_at) }}</span>
      </li>
    </DescriptionList>

    <!-- <Card -->
    <!--   v-for="item in attributes" -->
    <!-- > -->
    <!--   <h1>{{ item.trait_type }}</h1> -->
    <!--   <p>{{ item.value }}</p> -->
    <!-- </Card> -->
  </section>
</template>

<script setup>
const { opepen } = defineProps({ opepen: Object, })

const submission = computed(() => opepen.set.submission)
const attributes = computed(() => opepen.metadata?.attributes
  .filter(a => a.trait_type !== 'Number')
)
</script>

<style scoped>
</style>
