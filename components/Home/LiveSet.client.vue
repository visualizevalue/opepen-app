<template>
  <section v-if="isLive" class="live-set">
    <header class="live-header">
      <div class="badge">
        <span class="pulse" />
        <span>Live Now</span>
      </div>
      <span v-if="optInCountDown?.str" class="countdown">
        Closes in {{ optInCountDown.str }}
      </span>
    </header>

    <NuxtLink :to="`/submissions/${submission.uuid}`" class="preview-link">
      <SetPreviewImages :submission="submission" />
    </NuxtLink>

    <div class="meta">
      <NuxtLink :to="`/submissions/${submission.uuid}`" class="title">
        <h2>{{ submission.name }}</h2>
        <small>by {{ submission.artist }}</small>
      </NuxtLink>
      <dl class="figures">
        <div>
          <dt>Demand</dt>
          <dd>{{ formatNumber(demand) }}</dd>
        </div>
        <div>
          <dt>Holders</dt>
          <dd>{{ formatNumber(holders) }}</dd>
        </div>
      </dl>
    </div>

    <SetOptInCard :submission="submission" @update="reloadStagedSubmission" />
  </section>
</template>

<script setup>
const { submission, optInAvailable, optInCountDown, reloadStagedSubmission } =
  await useStagedOptIn()

// A staged set is "live" on the homepage while it is unrevealed and still open
// for opt-in.
const isLive = computed(
  () => !!submission.value?.uuid && !submission.value?.set_id && optInAvailable.value,
)

const demand = computed(() => submission.value?.submission_stats?.demand?.total ?? 0)
const holders = computed(() => submission.value?.submission_stats?.holders?.total ?? 0)
</script>

<style scoped>
/* Plain stack — the opt-in card below is the only bordered element, matching
   the submission page. No competing wrapper box. */
.live-set {
  display: grid;
  gap: var(--spacer);
}

.live-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacer);

  .badge {
    @mixin ui-font;
    display: inline-flex;
    align-items: center;
    gap: var(--size-2);
    color: var(--color);
  }

  .pulse {
    width: var(--size-2);
    height: var(--size-2);
    border-radius: 50%;
    background: var(--green, #3fb950);
    animation: pulse 2s infinite;
  }

  .countdown {
    @mixin ui-font;
    font-size: var(--font-xs);
    color: var(--gray-z-6);
    font-variant-numeric: tabular-nums;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--green, #3fb950) 60%, transparent);
  }
  70% {
    box-shadow: 0 0 0 0.4rem transparent;
  }
  100% {
    box-shadow: 0 0 0 0 transparent;
  }
}

.preview-link {
  display: block;
  text-decoration: none;
  border: 0;
}

.meta {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacer);
  flex-wrap: wrap;

  .title {
    text-decoration: none;
    border: 0;

    h2 {
      @mixin ui-font;
      font-size: var(--font-lg);
      line-height: 1.1;
      color: var(--color);
    }
    small {
      @mixin ui-font;
      color: var(--muted);
    }
  }

  .figures {
    display: flex;
    gap: var(--spacer-lg);
    margin: 0;

    div {
      text-align: right;
    }

    dt {
      @mixin ui-font;
      font-size: var(--font-xs);
      color: var(--gray-z-6);
    }
    dd {
      @mixin ui-font;
      font-size: var(--font-base);
      margin: 0;
      color: var(--color);
    }
  }
}
</style>
