<template>
  <div class="vote has-tertiary">
    <CurateOpepen @voted="refreshKey ++" />

    <ClientOnly>
      <TertiaryNav class="hidden-md">
        <CurationStats :refresh-key="refreshKey" />
      </TertiaryNav>
    </ClientOnly>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Curate Opepen',
})

const refreshKey = ref(0)
</script>

<style scoped>
.vote {
  height: 100%;
  padding-top: var(--navbar-height);

  @media (--md) {
    padding-top: 0;
  }
}

.has-tertiary {
  padding-right: 0;
}
</style>
