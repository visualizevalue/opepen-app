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

<script setup>
useMetaData({
  title: `Burned Opepen Stats | Opepen`,
  og: '/og/burned.jpg',
})
</script>

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
