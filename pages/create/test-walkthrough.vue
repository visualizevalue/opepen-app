<template>
  <PageFrameSm>
    <div class="test-warning">
      <Alert class="warning">
        <strong>⚠️ Testing Mode</strong>
        <p>This page bypasses authentication for UI testing only. Not for production use.</p>
      </Alert>
    </div>

    <SubmissionEntryPoint
      v-if="mockData"
      :submission-data="mockData"
      @updated="mockData = $event"
    />
  </PageFrameSm>
</template>

<script setup>
// Mock submission data for testing
const mockData = ref({
  uuid: 'test-uuid-123',
  name: '',
  description: '',
  creator: '0x0000000000000000000000000000000000000000',
  edition_type: null,
  edition1Image: null,
  edition4Image: null,
  edition5Image: null,
  edition10Image: null,
  edition20Image: null,
  edition40Image: null,
  edition1Name: '',
  edition4Name: '',
  edition5Name: '',
  edition10Name: '',
  edition20Name: '',
  edition40Name: '',
  artist: '',
  coCreators: [],
  published_at: null,
  approved_at: null,
  dynamicSetImages: {},
  richContentLinks: [],
})

useMetaData({
  title: 'Test Walkthrough | Opepen',
})
</script>

<style scoped>
.test-warning {
  margin-bottom: var(--spacer);
}

.warning {
  background: var(--warning-bg, rgba(var(--warning-rgb), 0.1));
  border-color: var(--warning);

  strong {
    color: var(--color);
  }

  p {
    margin: var(--spacer-xs) 0 0 0;
    font-size: var(--font-sm);
  }
}
</style>
