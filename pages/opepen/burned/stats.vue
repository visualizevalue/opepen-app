<template>
  <PageFrameMd>
    <PageHeader>
      <SectionTitle>
        <span>Burned Stats</span>
      </SectionTitle>
      <Actions>
        <Button class="gallery-button" to="/opepen/burned">Gallery</Button>
        <Button to="/opt-out">Opt out</Button>
      </Actions>
    </PageHeader>
    <BurnedStats />
  </PageFrameMd>
</template>

<style scoped>
.gallery-button {
  display: none;
}

@media (--lg) {
  .gallery-button {
    display: inline-block;
  }
}
</style>
