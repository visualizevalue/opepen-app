<template>
<PageHeader class="header">
  <h1>Assemble a Team</h1>
  <Button @click="download" class="small"><Icon type="download" /> Download</Button>
</PageHeader>

<article class="team">
  <div class="grid" ref="grid">
    <TeamOpepen
      v-for="(item) in items" :opepen="item.opepen" :disabled="item.disabled"
      :key="item._id"
      :_id="item._id"
      @click="openModal(item._id)"
    />
  </div>
  <Icon type="opepen" class="opepen-check" />
</article>

<TeamRendered ref="rendered" :items="items" :draw-key="drawKey" />

<!-- <Button @click="screenshot.renderElement(grid)">Save</Button>
<ScreenshotModal ref="screenshot" /> -->

<ChooseOpepenModal :open="modalOpen" @close="modalOpen = false" @select="select" />
</template>

<script setup>
import { useSortable } from '~/helpers/sortable-swappable'

const grid = ref(null)
const rendered = ref(null)
const download = () => rendered.value.download()

const items = ref(Array(64).fill(null).map((_, index) => {
  const row = parseInt(index / 8)
  const column = index % 8

  return {
    opepen: null,
    disabled: !(row > 1 && column > 1 && column < 6 && (row < 6 || row > 6)),
    _id: index,
  }
}))

const modalOpen = ref(false)
const selectFor = ref(null)
const drawKey = ref(0)
const openModal = (index) => {
  modalOpen.value = true
  selectFor.value = index
}
const select = (opepen) => {
  items.value[selectFor.value].opepen = opepen
  modalOpen.value = false
  drawKey.value ++
}

useSortable(grid, items, {
  animation: 250,
  swap: true,
  swapClass: 'highlight',
  onUpdate: (e) => {
    const array = [...items.value]

    const movedItem = array[e.oldIndex]
    const swappedItem = array[e.newIndex]

    array.splice(e.newIndex, 1, movedItem)
    nextTick(() => {
      array.splice(e.oldIndex, 1, swappedItem)

      items.value = array
      drawKey.value ++
    })
  },
})
</script>

<style lang="postcss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

article.team {
  position: relative;
  container-type: inline-size;
  width: 100%;
  max-width: var(--content-width);
  margin: var(--size-5) auto;
  overflow: hidden;
  border-radius: var(--size-2);
  border: var(--border);

  .opepen-check {
    position: absolute;
    width: 4.16cqw;
    height: 4.16cqw;
    top: calc(25cqw - 4.16cqw*2);
    right: calc(25cqw - 4.16cqw*2);
    z-index: 2;
    color: var(--gray-z-5);
  }

  .grid {
    display: flex;
    flex-wrap: wrap;
    height: 100cqw;

    > div {
      width: 12.5cqw;
      height: 12.5cqw;
      background: var(--gray-z-1);
      box-shadow: 0 0 0 1px var(--gray-z-2);

      &:nth-child(19),
      &:nth-child(20),
      &:nth-child(21),
      &:nth-child(22),
      &:nth-child(27),
      &:nth-child(28),
      &:nth-child(29),
      &:nth-child(30),
      &:nth-child(35),
      &:nth-child(36),
      &:nth-child(37),
      &:nth-child(38),
      &:nth-child(43),
      &:nth-child(44),
      &:nth-child(45),
      &:nth-child(46),
      &:nth-child(59),
      &:nth-child(60),
      &:nth-child(61),
      &:nth-child(62)
      {
        box-shadow: 0 0 0 1px var(--gray-z-4);
        z-index: 2;

        /* &:before {
          content: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19.1421 6.41421L17.7279 5L12.0711 10.6569L6.41421 5L5 6.41421L10.6569 12.0711L5 17.7279L6.41421 19.1421L12.0711 13.4853L17.7279 19.1421L19.1421 17.7279L13.4853 12.0711L19.1421 6.41421Z' fill='currentColor'/%3E%3C/svg%3E%0A");
        } */
      }

      &:nth-child(22),
      &:nth-child(30),
      &:nth-child(38),
      &:nth-child(46),
      &:nth-child(62)
      {
        width: calc(12.5cqw - 1px);
      }
      &:nth-child(43),
      &:nth-child(44),
      &:nth-child(45),
      &:nth-child(46) {
        height: calc(12.5cqw - 1px);
      }

      &:nth-child(23),
      &:nth-child(31),
      &:nth-child(39),
      &:nth-child(47),
      &:nth-child(63)
      {
        width: calc(12.5cqw + 1px);
      }

      &.highlight {
        z-index: 2;
        opacity: 0.75;
      }
    }
  }
}
</style>
