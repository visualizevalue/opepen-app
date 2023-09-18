<template>
  <div>
    <PageHeader>
      <h1 class="breadcrumb">
        <NuxtLink to="/create/sets">Create Sets</NuxtLink>
        <span class="separator">/</span>
        <span>Submit a set</span>
      </h1>

      <Alert class="inline info">
        <p>Base your art on the Opepen Schematics.</p>
        <Button
          to="https://raw.githubusercontent.com/visualizevalue-dev/opepen-api/main/app/Services/OpepenSVG/opepen-schematics.svg"
          target="_blank"
          download
          class="secondary"
        >Opepen Schematics</Button>
      </Alert>

      <SetSubmissionForm />
    </PageHeader>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Create set submission',
})
</script>

<style lang="postcss" scoped>
aside {
  margin: var(--size-6) 0 0;
}
</style>
