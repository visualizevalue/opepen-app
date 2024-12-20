<template>
  <article class="opepen-detail">
    <div class="wrapper">
      <!-- Left -->
      <div>
        <OpepenImage :token="opepen" :embed="animationURI" version="lg" />
        <div v-if="! opepen.set" class="patch"></div>
      </div>

      <!-- Right -->
      <div>
        <!-- Top Row -->
        <div class="row">
          <div>
            <Icon type="check" />
            <span>1 of {{ opepen.data.edition }}</span>
            <span class="muted">Opepen {{ opepen.token_id }}</span>
          </div>
          <div>
            <OpepenEditionSVG :edition="opepen.data.edition" :stroke="7" />
          </div>
        </div>

        <!-- Title -->
        <h1>{{ title }}</h1>

        <!-- Detail List -->
        <div v-if="opepen.set" class="attributes">
          <p><NuxtLink :to="setURL">Set "{{ submission.name }}"</NuxtLink></p>
          <p><NuxtLink :to="setURL">Release {{ pad(submission.set_id) }}</NuxtLink></p>
          <p><NuxtLink :to="`/${id(submission.creatorAccount)}`">By {{ submission.artist }}</NuxtLink></p>
          <p>{{ submission.edition_type }} editions</p>
          <p><NuxtLink :to="setURL">Consensus on {{ formatDate(submission.reveals_at) }}</NuxtLink></p>
        </div>

        <!-- Owner Details -->
        <div class="row">
          <div>
            <span class="muted">Owned By</span>
            <NuxtLink :to="`/${id(opepen.ownerAccount)}`">{{ opepen.ownerAccount.display }}</NuxtLink>
          </div>
          <span v-if="opepen.lastEvent" class="muted">
            <a :href="`https://etherscan.io/tx/${opepen.lastEvent.transaction_hash}`">
              Block {{ opepen.lastEvent.block_number }}
            </a>
          </span>
        </div>
      </div>
    </div>

    <NuxtLink v-if="link" :to="`/opepen/${opepen.token_id}`"><span>View {{ opepen.name }}</span></NuxtLink>
  </article>
</template>

<script setup>
import { id } from '~/helpers/accounts'
import { formatDate } from '~/helpers/dates'
import pad from '~/helpers/pad'
import { normalizeURI } from '~/helpers/urls'

const {
  opepen,
  link,
} = defineProps({
  opepen: Object,
  link: Boolean,
})

const metadata = computed(() => opepen.metadata)
const submission = computed(() => opepen.set?.submission)

const title = computed(() => submission.value
  ? submission.value[`edition${opepen.data.edition}Name`]
  : `Unrevealed`
)

const setURL = computed(() => `/sets/${pad(submission.value.set_id)}`)

const animationURI = computed(() => {
  if (! metadata.value?.animation_url) return

  return normalizeURI(metadata.value.animation_url)
})
</script>

<style lang="postcss" scoped>
.opepen-detail {
  container-type: inline-size;
  container-name: card;
  position: relative;
  display: grid;
  border: var(--border);
}

.opepen-detail > .wrapper {
  height: 100%;
  display: grid;
  grid-template-rows: repeat(2, 100cqw);
  height: calc(200cqw);

  @container (min-width: 32rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: auto;
    height: calc(50cqw);
  }

  /* Image */
  > div:first-child {
    position: relative;

    :deep(> .image) {
      width: 100%;
    }

    :deep(> .image > .inner),
    :deep(> .image > .image) {
      border-radius: 0;
      border: 0;
    }

    .patch {
      position: absolute;
      top: 0;
      right: 0;
      width: 15%;
      height: 15%;
      background-color: black;
    }
  }

  /* Content */
  > div:last-child {
    display: flex;
    padding: 10cqw;
    flex-direction: column;
    gap: 9cqw;
    container-type: inline-size;
    container-name: detail;
    border-top: var(--border);

    @container card (min-width: 32rem) {
      border-top: 0;
      border-left: var(--border);
      padding: 5cqw;
      gap: 4.5cqw;
    }

    > * {
      font-size: 4cqw;
    }

    > .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    > div:first-child {

      > div {
        display: grid;
        gap: 0.5em;
        line-height: 1em;
      }

      span {
        font-size: 1em;
      }

      span,
      .icon {
        display: block;
      }

      .icon {
        width: 1em;
        height: 1em;
      }

      svg {
        width: 17cqw;
        height: 17cqw;

        /* @container (min-width: 32rem) {
          width: 10cqw;
          height: 10cqw;
        } */
      }
    }

    > h1 {
      font-size: 10cqw;
      margin-left: calc(-1 * 0.05em);
      line-height: 1em;
    }

    > .attributes {
      display: grid;
      gap: 0.5em;

      p {
        font-size: 1em;
        line-height: 1em;
      }
    }

    > div:last-child {
      align-items: flex-end;

      > div:first-child {
        display: grid;
        gap: 0.5em;

        span,
        a {
          display: block;
          font-size: 1em;
          line-height: 1em;
        }
      }
    }
  }
}

.opepen-detail > a {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  span {
    opacity: 0;
  }
}
</style>
