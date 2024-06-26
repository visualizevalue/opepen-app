<template>
  <div class="vote has-tertiary">
    <CurateOpepen @voted="refreshKey ++" />

    <ClientOnly>
      <TertiaryNav class="hidden-md">
        <template #default>
          <CurationStats :refresh-key="refreshKey" />
        </template>
      </TertiaryNav>
    </ClientOnly>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Curate Opepen',
})

const stats = ref(null)

const refreshKey = ref(0)
</script>

<style lang="postcss" scoped>
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
