<template>
  <table>
    <slot />
  </table>
</template>

<style scoped>
table {
  @mixin ui-font;
  color: var(--color);
  font-variant-numeric: tabular-nums;

  /* Column headers are footnotes; the figures carry the weight. */
  :slotted(thead) {
    color: var(--muted);
    font-family: var(--font-family-brand);
    font-size: var(--label-font-size);
    font-weight: 400;
    letter-spacing: var(--label-letter-spacing);
    text-transform: uppercase;
  }

  :slotted(tr:not(:last-child:not(:first-child))) {
    border-bottom: var(--border);
  }

  :slotted(td) {
    white-space: nowrap;
    padding: 0.4375rem var(--spacer-sm);

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
