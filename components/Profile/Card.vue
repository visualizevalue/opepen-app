<template>
  <Card class="profile-card" :class="{ minimal }" :style="style">
    <Avatar :account="account" />
    <span>{{ account.display }}</span>
    <span v-if="account.tagline" class="tagline">{{ account.tagline }}</span>
    <CardLink :to="`/${id(account)}`">View {{ account.display }}</CardLink>
  </Card>
</template>

<script setup lang="ts">
interface Props {
  account: Account
  minimal: boolean
}
const { account, minimal } = defineProps<Props>()

const coverImageURL = imageURI(account.coverImage, 'sm')
const style = computed(() =>
  minimal
    ? []
    : {
        backgroundImage: `linear-gradient(to top, var(--opaque-black) 10%, var(--transparent-black) 150%)${coverImageURL ? `, url(${coverImageURL})` : ``}`,
      },
)
</script>

<style scoped>
.profile-card {
  position: relative;
  container-type: inline-size;
  background-color: var(--gray-z-2);
  background-size: cover;
  background-position: center center;
  min-height: 9rem;
  display: flex;
  flex-direction: column;
  gap: var(--spacer-xs);
  justify-content: center;
  align-items: center;

  .avatar {
    width: var(--size-8);
    height: var(--size-8);
    margin: 0 auto var(--spacer-sm);
  }

  span {
    display: block;
    text-align: center;
    @mixin ui-font;
  }

  .tagline {
    color: var(--muted);
  }

  &.minimal {
    align-items: flex-start;
    background: none;
    min-height: 0;
    padding: var(--spacer);

    .avatar {
      margin-left: 0;
      margin-right: 0;
    }

    span {
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      grid-column: 2;
    }
  }
}
</style>
