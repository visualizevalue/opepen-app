<template>
  <article class="opepen-detail">
    <div class="wrapper">
      <!-- Left -->
      <div>
        <OpepenImage :token="opepen" version="lg" />
      </div>

      <!-- Right -->
      <div>

        <!-- Title -->
        <div>
          <span class="muted"> Consensus Met </span>
          <h1>{{ opepen.name }}</h1>
        </div>

        <NuxtLink :to="`/opepen/${opepen.opepen.token_id}`" class="burned-opepen">
          <Image v-if="opepen.opepen.metadata?.image" :image="opepen.opepen.metadata.image" />
          <OpepenImage v-else :token="opepen.opepen" />
          <div class="attributes">
            <p>Opepen #{{ opepen.opepen.token_id }}</p>
            <p>Edition of {{ opepen.opepen.data.edition }}</p>
            <p>burned on {{ formatDate(opepen.burned_at) }}</p>
          </div>
        </NuxtLink>

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

  </article>
</template>

<script setup>
import { id } from '~/helpers/accounts'
import { formatDate } from '~/helpers/dates'

const { opepen } = defineProps({ opepen: Object })
</script>

<style scoped>
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
    justify-content: center;
    gap: 9cqw;
    container-type: inline-size;
    container-name: detail;
    border-top: var(--border);

    @container card (min-width: 32rem) {
      border-top: 0;
      border-left: var(--border);
      padding: 4cqw;
      gap: 3.5cqw;
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

    > div > h1 {
      font-size: 10cqw;
      margin-left: calc(-1 * 0.05em);
      line-height: 1em;
    }

    > .burned-opepen {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: flex-end;

      .attributes {
        display: grid;
        gap: var(--size-2);

        p {
          font-size: 1em;
          line-height: 1em;

          &:not(:first-child) {
            color: var(--gray-z-5);
          }
        }
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
