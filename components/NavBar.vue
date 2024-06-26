<template>
  <nav class="main" :class="{ 'scrolled': isScrolled }">
    <NuxtLink to="/curate" title="Opepen Home Page" class="home">
      OPEPEN.ART
    </NuxtLink>

    <ClientOnly>
      <Connect>
        <template #default>Check In</template>
        <template #connected="{ address, id }">
          <div class="account">
            <NuxtLink :to="`/${id}`">
              <Account :address="address" hide-avatar />
            </NuxtLink>

            <WithAccount #default="{ isAdmin }">
              <span v-if="isAdmin">
                <Button to="/admin" title="Admin"><Icon type="key"/></Button>
              </span>
            </WithAccount>
          </div>
        </template>
      </Connect>
    </ClientOnly>
  </nav>

  <nav class="links">
    <NuxtLink to="/curate">Curate</NuxtLink>
    <NuxtLink to="/collect">Collect</NuxtLink>
    <NuxtLink to="/create">Create</NuxtLink>
  </nav>
</template>

<script setup>
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()

const isScrolled = computed(() => y.value > 5)
</script>

<style lang="postcss" scoped>
  nav {
    position: fixed;
    left: 0;
    width: 100vw;
    height: var(--navbar-height);
    padding: var(--size-4);
    display: flex;
    align-items: center;
    gap: var(--size-3);
    z-index: 110;
    transition: all var(--speed-fast);
    background-color: transparent;
    border-color: transparent;
    background-color: var(--semi);
    backdrop-filter: var(--blur);

    @media (--max-md) {
      border-color: var(--gray-z-4);
    }

    :deep(> *) {
      height: var(--size-7);
      display: flex;
      align-items: center;

      @media (--md) {
        height: calc(var(--size-7) + var(--size-1));
      }
    }

    /* Default Page Padding */
    :deep(+ div) {
      position: relative;
      min-height: var(--100vh);
      padding: calc(var(--navbar-height) + var(--size-4)) var(--container-padding-x) calc(var(--navbar-height) + env(safe-area-inset-bottom));

      &.full {
        padding: var(--navbar-height) 0 calc(var(--navbar-height) + env(safe-area-inset-bottom));
        display: grid;
      }

      @media (--md) {
        padding-left: var(--size-6);
        padding-right: var(--size-6);

        &.full {
          padding-bottom: 0;
        }
      }
    }
  }

  nav.main {
    top: 0;
    border-bottom: var(--border);

    &.scrolled {
      border-color: var(--gray-z-4);
      background-color: var(--semi);
      backdrop-filter: var(--blur);
    }


    > .home {
      margin-right: auto;
      display: flex;
      align-items: center;

      :deep(.text) {
        display: none;

        @media (--lg) {
          display: initial;
        }
      }
    }

    a {
      color: var(--inactive);
      transition: color var(--speed);

      &:--highlight,
      &.router-link-active {
        color: var(--color);
      }
    }

    @media (--md) {
      padding-left: var(--size-6);
      padding-right: var(--size-6);
    }
  }

  nav.links {
    height: calc(var(--navbar-height) + env(safe-area-inset-bottom));
    padding-bottom: calc(var(--size-4) + env(safe-area-inset-bottom));

    bottom: 0;
    border-top: var(--border);
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    @media (--md) {
      gap: var(--size-8);
      justify-content: center;
    }

    > a {
      color: var(--inactive);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--size-3);
      transition: all var(--speed);
      position: relative;
      padding-left: 4vw;
      padding-right: 4vw;

      > .icon {
        color: var(--gray-z-7);
        transition: all var(--speed);
      }

      > span {
        display: none;

        @media (--sm) {
          display: inline-block;
        }
      }

      &:after {
        content: '';
        position: absolute;
        height: var(--size-0);
        border-radius: var(--size-0);
        width: 100%;
        background: transparent;
        transition: background var(--speed);
        top: calc(-1 * var(--size-3) - var(--size-1));

        @media (--sm) {
          top: auto;
          bottom: calc(-1 * var(--size-3) - var(--size-0));
        }
      }

      &:--highlight,
      &.router-link-active {
        color: var(--color);

        > .icon {
          color: var(--color);
        }

        &:after {
          background: var(--green);
        }
      }

      @media (--lg) {
        padding-left: 5vw;
        padding-right: 5vw;
      }
    }

    @media (--md) {
      backdrop-filter: none;
      background: transparent;
      border: none;
      bottom: auto;
      top: 0;
      z-index: 121;
      pointer-events: none;
      height: var(--navbar-height);
      padding-bottom: var(--size-4);

      > a {
        pointer-events: all;
      }
    }
  }

  .account {
    display: flex;
    gap: var(--size-2);
    align-items: center
  }
</style>
