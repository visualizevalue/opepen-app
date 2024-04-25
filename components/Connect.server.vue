<template>
  <div>
    <Button id="main-connect">
      <slot>
        <img src="https://ipfs.vv.xyz/ipfs/QmaYoRC1pYT9iHSRd7aDhnQeysajJbpPFXnBwrGwTcr75J/1.svg" alt="Default avatar" class="avatar">

        <span>Check-In</span>
      </slot>
    </Button>
  </div>
</template>

<style lang="postcss" scoped>
.avatar {
  margin-left: calc(-2 * var(--size-2) - 1px);
  width: var(--size-7) !important;
  height: var(--size-7) !important;
  border-radius: 50%;
  border-top-left-radius: var(--size-1);
  border: var(--border);

  img {
    width: 100%;
    height: 100%;
  }

  @media (--md) {
    height: calc(var(--size-7) + var(--size-1)) !important;
    width: calc(var(--size-7) + var(--size-1)) !important;
  }
}
</style>
