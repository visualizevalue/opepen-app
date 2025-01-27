<template>
  <section v-if="account.quote || account.bio" class="bio" :class="{ 'col-2': account.quote && account.bio }">
    <blockquote v-if="account.quote">
      <span>{{ account.quote }}</span>
      <cite>{{ account.display }}</cite>
    </blockquote>
    <p v-if="account.bio">{{ account.bio }}</p>
  </section>

  <section v-if="account.richContentLinks?.length" class="known-for">
    <SectionTitle>Known For</SectionTitle>
    <RichContentLinks :links="account.richContentLinks" />
  </section>

  <section v-if="account.createdSets?.length">
    <SectionTitle>Artist For Set<template v-if="account.createdSets.length > 1">s</template></SectionTitle>
    <div class="created-sets">
      <SetPreview v-for="set in account.createdSets" :data="set" />
    </div>
  </section>

  <SinglePostsGallery :address="account.address">
    <template #before>
      <SectionTitle>Single Opepen Posts</SectionTitle>
    </template>
    <template #empty><template></template></template>
  </SinglePostsGallery>

  <!-- TODO: Improve performance for long lists! -->
  <PaginatedContent
    :url="tokensUrl"
    query="limit=24"
    v-slot="{ items, meta }"
  >
    <div v-if="items.length">
      <SectionTitle>Owned Opepen ({{ meta.total }})</SectionTitle>
      <div class="opepens">
        <div
          v-for="token in items"
          :key="token.token_id"
        >
          <OpepenCard
            :token="token"
            :set="token.data?.edition || 40"
          />
        </div>
      </div>
    </div>
  </PaginatedContent>
  <PaginatedContent
    :url="burnedTokensUrl"
    query="limit=24"
    v-slot="{ items, meta }"
  >
    <div v-if="items.length">
      <SectionTitle>Burned Opepen ({{ meta.total }})</SectionTitle>
      <div class="opepens">
        <div
          v-for="token in items"
          :key="token.token_id"
        >
          <BurnedOpepenCard
            :token="token"
          />
        </div>
      </div>
    </div>
  </PaginatedContent>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'

const props = defineProps({ account: Object })
const account = computed(() => props.account)

const config = useRuntimeConfig()
const route = useRoute()
const url = `${config.public.opepenApi}/accounts/${route.params.id}`
const tokensUrl = `${url}/opepen`
const burnedTokensUrl = `${url}/burned`

// const frameButtons = [
//   { property: 'fc:frame:button:1', content: `View on on Opepen.art` },
//   { property: 'fc:frame:button:1:action', content: `link` },
//   { property: 'fc:frame:button:1:target', content: `https://opepen.art/holders/${account.value.address}` },
//   { property: 'fc:frame:button:2', content: 'Browse Opepen →' },
// ]

useMetaData({
  title: `${ account.value?.display } | Opepen`,
  description: `Opepen owned by ${account.value?.display}.`,
  og: `${config.public.opepenApi}/render/accounts/${account.value.address}/image`,
  meta: [
    // TODO: Fix and reenable these frames
    // { property: 'fc:frame', content: 'vNext' },
    // { property: 'fc:frame:image', content: `https://api.opepen.art/v1/frames/accounts/${account.value.address}/image` },
    // { property: 'fc:frame:post_url', content: `https://api.opepen.art/v1/frames/accounts/${account.value.address}` },
    // ...frameButtons,
  ],
})
</script>

<style lang="postcss" scoped>
.holder {
  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--size-8);

  @media (--md) {
    gap: var(--size-9);
  }

  > .socials {
    margin-top: calc(-1 * var(--size-8) + var(--size-4));
    padding: 0 var(--size-4);

    @media (--md) {
      margin-top: calc(-1 * var(--size-9) + var(--size-4));
    }
  }
}

header {
  position: relative;
  container-type: inline-size;
  margin-top: 5cqh;
  background-color: var(--gray-z-2);
  background-size: cover;
  background-position: center center;
  border: var(--border);
  border-radius: var(--size-5);
  border-top-left-radius: var(--size-1);

  > div {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: var(--size-4);
    padding: var(--size-4);
    min-height: 23cqw;
    width: 100cqw;

    @media (--md) {
      max-height: 33.33cqw;
    }
  }

  .avatar {
    width: var(--size-9);
    height: var(--size-9);
    border-top-left-radius: var(--size-2);
    margin-top: -5cqh;
    border-color: var(--gray-300);

    @media (--md) {
      width: calc(var(--size-9) * 2);
      height: calc(var(--size-9) * 2);
    }
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: var(--size-1);
  }

  h1 {
    margin-top: var(--size-2);
    display: flex;
    align-items: baseline;
    gap: var(--size-4);
    flex-wrap: wrap;
    color: var(--white);

    span {
      font-family: var(--font-family-opepen);
      font-size: var(--font-title);
      height: 1em;
    }

    small {
      font-size: var(--font-base);
    }
  }

  .meta-separated {
    color: var(--gray-700);
  }

  .socials {
    @media (--md) {
      position: absolute;
      top: var(--size-4);
      right: var(--size-4);
      max-width: 70%;
      justify-content: flex-end;
    }
  }
}

.bio {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--size-8);
  padding: var(--size-4);

  > * {
    width: 100%;
  }

  @media (--md) {
    flex-direction: row;

    > * {
      max-width: 50%;
    }

    &.col-2 {
      > * {
        width: 50%;
      }
    }
  }

  blockquote,
  p {
    white-space: pre-line;
  }

  blockquote {
    position: relative;

    &:before {
      content: '"';
      position: absolute;
      left: -0.7em;
    }

    &:before,
    span {
      font-family: var(--font-family-display);
      font-style: italic;
      font-size: var(--font-xl);
      line-height: var(--line-height-md);
    }

    cite {
      display: block;
      font-size: var(--font-base);
      color: var(--gray-z-5);
      margin-top: var(--size-3);

      &:before {
        content: "- ";
      }
    }
  }
}

.known-for {
  h1 {
    margin-bottom: var(--size-2);
  }
}

.opepens {
  display: grid;
  justify-content: center;
  container-type: inline-size;
  flex-wrap: wrap;
  max-width: var(--content-width);
  width: 100%;
  gap: var(--size-4);
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
}

.created-sets {
  display: grid;
  gap: var(--size-4);

  > * {
    width: 100%;
  }
}
</style>
