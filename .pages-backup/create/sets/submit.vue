<template>
  <div class="submit">
    <SectionTitle>
      Create Set
    </SectionTitle>

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
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

useMetaData({
  title: 'Create set submission',
})
</script>

<style scoped>
aside {
  margin: var(--size-6) 0 0;
}

.submit {
  max-width: var(--content-width);
  margin: 0 auto;
}
</style>
