<template>
  <div class="submit-single">
    <SectionTitle>Create Single Opepen</SectionTitle>

    <Alert class="inline info">
      <p>Base your art on the Opepen Schematics.</p>
      <Button
        to="https://raw.githubusercontent.com/visualizevalue-dev/opepen-api/main/app/Services/OpepenSVG/opepen-schematics.svg"
        target="_blank"
        download
        class="secondary"
      >Opepen Schematics</Button>
    </Alert>

    <PostCreateSingle key="create-single" />
  </div>
</template>

<style scoped>
.submit-single {
  max-width: var(--content-width-sm) !important;
}

:deep(.info) {
  margin-bottom: var(--size-7);
}
</style>
