<template>
  <aside>
    <ul>
      <li>
        <a href="https://zora.co/collect/eth:0x6339e5e072086621540d0362c4e3cea0d643e114" target="_blank" title="Zora" class="opensea"><Icon type="zora" /></a>
      </li>
      <li>
        <a href="https://opensea.io/collection/opepen-edition" target="_blank" title="OpenSea" class="opensea"><Icon type="opensea" /></a>
      </li>
      <li>
        <a href="https://visualizevalue.com/collections/opepen" target="_blank" title="Merch"><Icon type="shopping-bag" /></a>
      </li>
      <li>
        <a href="https://visualizevalue.com" target="_blank" title="Visualize Value"><Icon type="vv" /></a>
      </li>
      <li>
        <a href="https://github.com/visualizevalue-dev/opepens-metadata-api" target="_blank" title="Github"><Icon type="github" /></a>
      </li>
      <li>
        <a href="https://x.com/opepenedition" target="_blank" title="X / Twitter"><Icon type="x.com" /></a>
      </li>
    </ul>
  </aside>
</template>

<style lang="postcss" scoped>
aside {
  position: fixed;
  bottom: 0;
  left: 0;
  background: var(--semi);
  backdrop-filter: var(--blur);
  border-top: var(--border-dark);
  border-right: var(--border-dark);
  border-top-right-radius: var(--size-2);
  padding: 0 var(--size-2);
  z-index: 99;

  ul,
  li,
  a {
    margin: 0;
    display: flex;
    align-items: center;
  }

  a {
    padding: var(--size-2);
    color: var(--gray-z-5);
    transition: color var(--speed);

    &:--highlight {
      color: var(--color);
    }
  }

  .icon {
    width: var(--size-4);
    margin-top: var(--size-0);
  }

  svg {
    width: 100%;
    max-width: var(--size-4);
    max-height: var(--size-4);
  }

  .opensea {
    margin: 0 -0.25em 0 0;

    svg {
      max-width: 1.4rem;
    }
  }
}
</style>
