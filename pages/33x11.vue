<template>
  <PageFrameMd class="tool">
    <header class="intro">
      <h1 class="eyebrow">33x11</h1>
    </header>

    <section class="toolbar">
      <button
        v-for="option in TOOLS"
        :key="option.id"
        type="button"
        class="tool-toggle unstyled"
        :class="{ active: tool === option.id }"
        :title="`${option.label} (${option.key.toUpperCase()})`"
        :aria-pressed="tool === option.id"
        @click="tool = option.id"
      >
        <Icon :type="option.icon" />
        <span>{{ option.label }}</span>
      </button>
    </section>

    <section class="palette">
      <button
        v-for="(color, index) in PALETTE_11"
        :key="color.hex"
        type="button"
        class="swatch unstyled"
        :class="{ active: index === activeColor }"
        :style="{ '--swatch': color.hex }"
        :title="`${color.name} (${index + 1 === 11 ? 0 : index + 1})`"
        :aria-label="color.name"
        :aria-pressed="index === activeColor"
        @click="activeColor = index"
      >
        <span class="chip"></span>
      </button>
    </section>

    <!--
      One grid of plain divs rather than a button per pixel: painting is driven
      by the pointer's position over the board, so a drag keeps painting even
      though the pointer never leaves the element it was pressed on.
    -->
    <section class="board">
      <div
        ref="grid"
        class="cells"
        :style="gridStyle"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="stopPainting"
        @pointercancel="stopPainting"
        @contextmenu.prevent
      >
        <div
          v-for="(color, index) in composite"
          :key="index"
          class="cell"
          :class="{ 'panel-edge': index % COMPOSITION_WIDTH !== 0 && index % PANEL === 0 }"
          :style="{ background: color }"
        ></div>
      </div>
    </section>

    <section class="layers">
      <header>
        <SectionTitle class="small">Layers</SectionTitle>
        <Button class="small" @click="addLayer">
          <Icon type="plus" />
          <span>Add</span>
        </Button>
      </header>

      <!-- Topmost first, the way it stacks on the canvas. -->
      <ul>
        <li
          v-for="layer in stack"
          :key="layer.id"
          class="layer"
          :class="{ active: layer.index === activeLayer }"
        >
          <button
            type="button"
            class="visibility unstyled"
            :title="layer.visible ? 'Hide' : 'Show'"
            @click="toggleVisible(layer.index)"
          >
            <Icon :type="layer.visible ? 'eye' : 'eye-off'" />
          </button>

          <button type="button" class="select unstyled" @click="activeLayer = layer.index">
            <span>{{ layer.name }}</span>
          </button>

          <button
            type="button"
            class="remove unstyled"
            title="Delete layer"
            :disabled="layers.length === 1"
            @click="removeLayer(layer.index)"
          >
            <Icon type="trash-2" />
          </button>
        </li>
      </ul>
    </section>

    <section class="actions">
      <div class="field">
        <label for="scale">Export</label>
        <select id="scale" v-model.number="scale">
          <option v-for="option in SCALES" :key="option" :value="option">
            {{ COMPOSITION_WIDTH * option }} x {{ COMPOSITION_HEIGHT * option }}
          </option>
        </select>
      </div>

      <div class="buttons">
        <Button class="small" title="Undo (Cmd Z)" :disabled="!canUndo" @click="undo">
          <Icon type="corner-up-left" />
          <span>Undo</span>
        </Button>
        <Button class="small" title="Redo (Shift Cmd Z)" :disabled="!canRedo" @click="redo">
          <Icon type="corner-up-right" />
          <span>Redo</span>
        </Button>
        <Button class="small" @click="clear">
          <span>Clear</span>
        </Button>
        <Button class="small" @click="download">
          <Icon type="download" />
          <span>Download</span>
        </Button>
      </div>
    </section>
  </PageFrameMd>
</template>

<script setup>
const SCALES = [8, 16, 32, 64, 128]
const TOOLS = [
  { id: 'pencil', label: 'Pencil', icon: 'edit-2', key: 'p' },
  { id: 'fill', label: 'Fill', icon: 'droplet', key: 'f' },
  { id: 'eraser', label: 'Eraser', icon: 'x-square', key: 'e' },
]

const SIZE = COMPOSITION_WIDTH * COMPOSITION_HEIGHT
// The ground the layers sit on, and what an erased pixel reveals.
const GROUND = '#ffffff'

let nextId = 1
const emptyLayer = (name) => ({
  id: nextId++,
  name,
  visible: true,
  // null is transparent; anything else indexes the palette.
  cells: Array(SIZE).fill(null),
})

const layers = ref([emptyLayer('Layer 1')])
const activeLayer = ref(0)
const activeColor = ref(0)
const scale = ref(SCALES[SCALES.length - 1])
const tool = ref('pencil')
const painting = ref(false)
const grid = ref()

/* Topmost first for the list; the array itself stays bottom-up. */
const stack = computed(() =>
  layers.value
    .map((layer, index) => ({ ...layer, index }))
    .slice()
    .reverse(),
)

/* Flatten what is visible: the highest layer holding a pixel wins. */
const composite = computed(() => {
  const out = Array(SIZE).fill(GROUND)

  for (const layer of layers.value) {
    if (!layer.visible) continue

    for (let i = 0; i < SIZE; i++) {
      const cell = layer.cells[i]
      if (cell !== null) out[i] = PALETTE_11[cell].hex
    }
  }

  return out
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${COMPOSITION_WIDTH}, minmax(0, 1fr))`,
}))

/*
 * History holds whole snapshots of `layers`. Every write replaces the array and
 * the cells inside it rather than mutating, so an old reference stays a valid
 * past state. Snapshots are taken per gesture, so a drag undoes as one stroke.
 */
const HISTORY_LIMIT = 100
const past = ref([])
const future = ref([])

const canUndo = computed(() => past.value.length > 0)
const canRedo = computed(() => future.value.length > 0)

const commit = () => {
  past.value = [...past.value, layers.value].slice(-HISTORY_LIMIT)
  future.value = []
}

const undo = () => {
  if (!past.value.length) return

  const previous = past.value[past.value.length - 1]
  past.value = past.value.slice(0, -1)
  future.value = [...future.value, layers.value]
  layers.value = previous
  activeLayer.value = Math.min(activeLayer.value, previous.length - 1)
}

const redo = () => {
  if (!future.value.length) return

  const next = future.value[future.value.length - 1]
  future.value = future.value.slice(0, -1)
  past.value = [...past.value, layers.value]
  layers.value = next
  activeLayer.value = Math.min(activeLayer.value, next.length - 1)
}

const writeActive = (mutate) => {
  const next = layers.value.slice()
  const cells = next[activeLayer.value].cells.slice()

  mutate(cells)
  next[activeLayer.value] = { ...next[activeLayer.value], cells }
  layers.value = next
}

const paint = (index, value) => {
  if (layers.value[activeLayer.value].cells[index] === value) return

  writeActive((cells) => {
    cells[index] = value
  })
}

/* Flood the contiguous run on the active layer only, four-connected. */
const fill = (start) => {
  const cells = layers.value[activeLayer.value].cells
  const target = cells[start]
  if (target === activeColor.value) return

  writeActive((next) => {
    const stackOfCells = [start]

    while (stackOfCells.length) {
      const index = stackOfCells.pop()
      if (next[index] !== target) continue

      next[index] = activeColor.value

      const x = index % COMPOSITION_WIDTH
      const y = Math.floor(index / COMPOSITION_WIDTH)

      if (x > 0) stackOfCells.push(index - 1)
      if (x < COMPOSITION_WIDTH - 1) stackOfCells.push(index + 1)
      if (y > 0) stackOfCells.push(index - COMPOSITION_WIDTH)
      if (y < COMPOSITION_HEIGHT - 1) stackOfCells.push(index + COMPOSITION_WIDTH)
    }
  })
}

const apply = (index) => {
  if (index < 0) return

  if (tool.value === 'fill') {
    commit()
    return fill(index)
  }
  if (tool.value === 'eraser') return paint(index, null)

  paint(index, activeColor.value)
}

/*
 * Work out the pixel under the pointer rather than listening on each cell.
 * A pointer pressed inside the grid keeps its target for the whole gesture, so
 * per-cell enter events never fire during a drag.
 */
const cellAt = (event) => {
  const rect = grid.value?.getBoundingClientRect()
  if (!rect) return -1

  const x = Math.floor(((event.clientX - rect.left) / rect.width) * COMPOSITION_WIDTH)
  const y = Math.floor(((event.clientY - rect.top) / rect.height) * COMPOSITION_HEIGHT)

  if (x < 0 || y < 0 || x >= COMPOSITION_WIDTH || y >= COMPOSITION_HEIGHT) return -1

  return y * COMPOSITION_WIDTH + x
}

const onPointerDown = (event) => {
  // Capture so the drag survives leaving the board, and so touch doesn't scroll.
  grid.value?.setPointerCapture?.(event.pointerId)
  painting.value = true
  // One snapshot per stroke: a drag undoes in one step, not pixel by pixel.
  if (tool.value !== 'fill') commit()
  apply(cellAt(event))
}
const onPointerMove = (event) => {
  // Fill is a single decision; only the pencil and eraser drag.
  if (!painting.value || tool.value === 'fill') return

  apply(cellAt(event))
}
const stopPainting = (event) => {
  painting.value = false
  if (event?.pointerId !== undefined) grid.value?.releasePointerCapture?.(event.pointerId)
}

const addLayer = () => {
  commit()
  layers.value = [...layers.value, emptyLayer(`Layer ${layers.value.length + 1}`)]
  activeLayer.value = layers.value.length - 1
}
const removeLayer = (index) => {
  if (layers.value.length === 1) return

  commit()
  layers.value = layers.value.filter((_, i) => i !== index)
  activeLayer.value = Math.min(activeLayer.value, layers.value.length - 1)
}
const toggleVisible = (index) => {
  const next = layers.value.slice()
  next[index] = { ...next[index], visible: !next[index].visible }
  layers.value = next
}

const clear = () => {
  commit()
  writeActive((cells) => cells.fill(null))
}

/*
 * Draw the composition at its true 33x11 then blow it up with smoothing off, so
 * every exported pixel stays a hard square rather than a blurred one.
 */
const download = () => {
  const source = document.createElement('canvas')
  source.width = COMPOSITION_WIDTH
  source.height = COMPOSITION_HEIGHT

  const sourceContext = source.getContext('2d')
  const image = sourceContext.createImageData(COMPOSITION_WIDTH, COMPOSITION_HEIGHT)

  composite.value.forEach((hex, index) => {
    const offset = index * 4
    image.data[offset] = parseInt(hex.slice(1, 3), 16)
    image.data[offset + 1] = parseInt(hex.slice(3, 5), 16)
    image.data[offset + 2] = parseInt(hex.slice(5, 7), 16)
    image.data[offset + 3] = 255
  })
  sourceContext.putImageData(image, 0, 0)

  const output = document.createElement('canvas')
  output.width = COMPOSITION_WIDTH * scale.value
  output.height = COMPOSITION_HEIGHT * scale.value

  const outputContext = output.getContext('2d')
  outputContext.imageSmoothingEnabled = false
  outputContext.drawImage(source, 0, 0, output.width, output.height)

  output.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `33x11-${output.width}x${output.height}.png`
    link.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

const onKey = (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
    event.preventDefault()
    return event.shiftKey ? redo() : undo()
  }

  if (event.metaKey || event.ctrlKey || event.altKey) return

  const shortcut = TOOLS.find((option) => option.key === event.key.toLowerCase())
  if (shortcut) {
    tool.value = shortcut.id
    return
  }

  const index = event.key === '0' ? 10 : Number(event.key) - 1
  if (Number.isInteger(index) && index >= 0 && index < PALETTE_11.length) {
    activeColor.value = index
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

useMetaData({
  title: `33x11 | Opepen`,
  description: `Build a 33x11 composition in the eleven colors of 11x11.`,
})
</script>

<style scoped>
.tool {
  gap: var(--spacer-lg);
}

.eyebrow {
  @mixin ui-font;
  color: var(--muted);
  font-size: var(--ui-font-size);
}

.intro {
  display: grid;
}

.toolbar {
  display: flex;
  gap: var(--spacer-sm);
}

.tool-toggle {
  @mixin ui-font;
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
  width: fit-content;
  padding: var(--spacer-xs) var(--spacer-sm);
  border: var(--border);
  background: none;
  color: var(--muted);
  cursor: pointer;
  transition:
    color var(--speed),
    border-color var(--speed);

  .icon {
    width: var(--size-4);
  }

  &.active {
    color: var(--color);
    border-color: var(--color);
  }
}

.palette {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacer-sm);
}

.swatch {
  display: grid;
  justify-items: center;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;

  .chip {
    display: block;
    width: var(--size-6);
    height: var(--size-6);
    background: var(--swatch);
    border: var(--border);
    transition: box-shadow var(--speed);
  }

  /* The number keys still select colours; they just aren't labelled. */
  &.active .chip {
    box-shadow:
      0 0 0 2px var(--background),
      0 0 0 3px var(--color);
  }
}

.board {
  border: var(--border);
}

/*
 * Square by construction: 33 equal columns and 11 equal rows inside a 3:1 box,
 * so a row is exactly as tall as a column is wide. Sizing each cell with its
 * own aspect-ratio instead leaves sub-pixel seams between the grid tracks.
 */
.cells {
  display: grid;
  grid-template-rows: repeat(11, minmax(0, 1fr));
  aspect-ratio: 3 / 1;
  width: 100%;
  cursor: crosshair;
  /* Let a finger draw instead of scrolling the page. */
  touch-action: none;
}

.cell {
  /*
   * A hairline every 11 columns: three 11x11 panels, not one long strip.
   * Mid grey so it stays legible over both ends of the palette.
   */
  &.panel-edge {
    box-shadow: inset 1px 0 0 var(--gray-z-5);
  }
}

.layers {
  display: grid;
  gap: var(--spacer-sm);

  > header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    /* Buttons default to full width; this one sits beside the title. */
    .button {
      width: fit-content;
    }
  }

  ul {
    display: grid;
    border-top: var(--border);
  }
}

.layer {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--spacer-sm);
  padding: var(--spacer-xs) 0;
  border-bottom: var(--border);

  button {
    @mixin ui-font;
    background: none;
    border: 0;
    padding: 0;
    color: var(--muted);
    cursor: pointer;
    transition: color var(--speed);

    &:hover:not(:disabled) {
      color: var(--color);
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  .select {
    text-align: left;
    width: 100%;
  }

  .icon {
    display: block;
    width: var(--size-4);
  }

  &.active .select {
    color: var(--color);
  }
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacer);
  align-items: center;
  justify-content: space-between;
}

.field {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);

  label {
    @mixin ui-font;
    color: var(--muted);
    font-size: var(--ui-font-size);
  }
}

.buttons {
  display: flex;
  gap: var(--spacer-sm);
}
</style>
