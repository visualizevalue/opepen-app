<template>
  <Card
    class="profile-card"
    :style="{
      backgroundImage: `linear-gradient(to top, var(--opaque-black) 10%, var(--transparent-black) 150%), url(${coverImageURL})`
    }"
  >
    <Avatar :account="account" />
    <span>{{ account.display }}</span>
    <span v-if="account.tagline" class="tagline">{{ account.tagline }}</span>
    <CardLink :to="`/${id(account)}`">View {{account.display}}</CardLink>
  </Card>
</template>

<script setup lang="ts">
interface Props {
  account: Account
}
const { account } = defineProps<Props>()

const coverImageURL = imageURI(account.coverImage, 'sm')
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
    gap: var(--spacer-sm);
    justify-content: center;
    align-items: center;

    .avatar {
      width: var(--size-8);
      height: var(--size-8);
      margin: 0 auto;
    }

    span {
      display: block;
      text-align: center;
      @mixin ui-font;
    }

    .tagline {
      color: var(--muted);
    }
  }
</style>

