<template>
  <header
    :style="{
      backgroundImage: `linear-gradient(to top, var(--opaque-black) 10%, var(--transparent-black) 150%), url(${coverImageURL})`
    }"
  >
    <div>
      <Avatar :account="account" :size="256" class="avatar" />
      <div class="text">
        <h1>
          <span>{{ account.display }}</span>
          <small v-if="account.tagline">{{ account.tagline }}</small>
        </h1>
        <NuxtLink :to="`https://etherscan.io/address/${account.address}`" target="_blank" class="meta-separated">
          <span v-if="account.ens">{{ account.ens }}</span>
          <span>{{ shortAddress(account.address, 6) }}</span>
        </NuxtLink>
        <SocialLinks :links="links" class="socials" always-show>
          <template #last>
            <IsMe :address="account.address">
              <li>
                <Button to="/settings" class="small">
                  <Icon type="settings" />
                  <span>Settings</span>
                </Button>
              </li>
            </IsMe>
          </template>
        </SocialLinks>
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  account: Object,
  links: Array,
})

const coverImageURL = computed(() => imageURI(props.account.coverImage, 'lg'))
</script>

<style scoped>
header {
  position: relative;
  container-type: inline-size;
  background-color: var(--gray-z-2);
  background-size: cover;
  background-position: center center;
  margin: calc(-1 * var(--spacer)) calc(-1 * var(--spacer)) 0;
  width: calc(100% + var(--spacer)*2);
  border-bottom: var(--border);

  @media (--md) {
    border: var(--border);
    border-radius: var(--border-radius);
    margin: 0;
    width: 100%;
  }

  > div {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: var(--spacer);
    padding: var(--spacer);
    min-height: 23cqw;
    width: 100cqw;

    @container (min-width: 30rem) {
      min-height: 0;
    }

    @container (min-width: 50rem) {
      padding: var(--spacer-lg);
    }
  }

  .avatar {
    width: var(--size-9);
    height: var(--size-9);
    margin: 0 auto;

    @container (min-width: 30rem) {
      margin: 0 0 var(--spacer-sm);
      width: var(--size-10);
      height: var(--size-10);
    }
  }

  .text,
  h1,
  .meta-separated {
    text-align: center;
    justify-content: center;

    @container (min-width: 30rem) {
      justify-content: flex-start;
      text-align: left;
    }
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-sm);

    @mixin ui-font;
  }

  h1 {
    display: flex;
    align-items: baseline;
    gap: var(--spacer-sm);
    flex-wrap: wrap;
    color: var(--white);

    span {
      font-size: var(--font-xl);
    }

    small {
      font-size: var(--font-base);
    }
  }

  .meta-separated {
    color: var(--gray-600);
    display: flex;
    gap: var(--spacer-sm);

    &:--highlight {
      color: var(--color);
    }
  }

  .socials {
    justify-content: center;

    @container (min-width: 30rem) {
      position: absolute;
      top: var(--size-4);
      right: var(--size-4);
      max-width: 70%;
      justify-content: flex-end;
    }
  }
}
</style>
