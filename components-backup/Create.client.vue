<template>
  <div class="create-set">
    <div class="actions">
      <Button to="/create/sets/submit">
        <Icon type="upload" />
        <span>Upload Set</span>
      </Button>

      <Button to="/create/sets" class="secondary">
        <Icon type="grid" />
        <span>Manage Sets</span>
      </Button>

      <Button v-if="isAdmin" to="/create/sets/admin" class="secondary">
        <Icon type="key" />
        <span>Administrate Sets</span>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { isAdmin } from '~/helpers/siwe'
</script>v

<style lang="postcss" scoped>
  .create-set {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;

    > span {
      position: relative;
      width: 100%;
      max-width: 24rem;
      text-align: center;
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-md);
      margin: var(--size-5) 0 var(--size-8);
      color: var(--gray-z-5);
      font-size: var(--font-sm);

      &:before,
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        height: 1px;
        z-index: -1;
      }

      &:before {
        left: 0;
        width: 100%;
        background-color: var(--gray-z-2);
      }

      &:after {
        left: calc(50% - 1.5rem);
        width: 3rem;
        background-color: var(--background);
      }
    }

    > small {
      margin-top: var(--size-3);
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: var(--size-4);
    }
  }
</style>
