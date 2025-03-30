<template>
  <table>
    <slot />
  </table>
</template>

<style scoped>
table {
  @mixin ui-font;
  color: var(--muted);

  :slotted(thead) {
    color: var(--color);
  }

  :slotted(tr:not(:last-child:not(:first-child))) {
    border-bottom: var(--border);
  }

  :slotted(td) {
    white-space: nowrap;
    padding: var(--size-1) var(--spacer-sm);

    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      padding-right: 0;
    }
  }

  :slotted(tfoot) {
    tr {
      border-bottom: 0 !important;
      border-top: var(--border);
    }
  }
}
</style>
