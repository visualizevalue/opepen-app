<template>
  <div class="expandable-timeline">
    <OptInTimelineList
      :refresh-key="refreshKey"
      :submission-id="submissionId"
      :limit="3"
      :auto-load="false"
    >
      <template v-slot:after="{ meta }">
        <div class="overlay">
          <div class="bg"></div>
          <button @click="expanded = true" v-if="meta?.total > 3" title="Expand"><Icon type="chevron-down" /></button>
        </div>
      </template>
    </OptInTimelineList>

    <Modal
      :open="expanded"
      @close="expanded = false"
      modal-classes="history-modal"
      scroll
    >
      <header>
        <h1>Opt-In History</h1>
      </header>
      <section>
        <OptInTimelineList :submission-id="submissionId" />
      </section>
    </Modal>
  </div>
</template>

<script setup>
const {
  submissionId,
  expandable,
} = defineProps({
  refreshKey: String,
  submissionId: String,
  expandable: {
    type: Boolean,
    default: true,
  },
})

const expanded = ref(false)
</script>

<style>
.expandable-timeline {
  position: relative;
  padding-bottom: var(--size-5);

  .overlay {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: absolute;
    width: 100%;
    height: 75%;
    bottom: 0;
    pointer-events: none;

    .bg {
      position: absolute;
      background: linear-gradient(to top, var(--background), var(--transparent-background));
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    button {
      padding: var(--size-4);
      z-index: 1;
      pointer-events: all;
    }
  }
}

</style>

<style>
.history-modal {
  .scroll {
    > header,
    > section {
      padding: var(--size-4);
    }
    > header {
      border-bottom: var(--border-dark);
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--semi);
      backdrop-filter: var(--blur);
    }
    > section {
      padding-top: var(--size-4);
    }
  }
}
</style>
