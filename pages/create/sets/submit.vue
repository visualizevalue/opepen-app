<template>
  <div>
    <PageHeader>
      <h1 class="breadcrumb">
        <NuxtLink to="/create/sets">Create Sets</NuxtLink>
        <span class="separator">/</span>
        <span>Submit a set</span>
      </h1>

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
