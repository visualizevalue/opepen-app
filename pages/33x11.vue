<template>
  <PageFrameMd class="tool">
    <header class="intro">
      <p class="eyebrow">Tool</p>
      <h1>33x11</h1>
      <p class="summary">
        Three panels. Eleven colors. Draw a composition and take it with you at any size.
      </p>
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

    <section
      class="board"
      @pointerdown="startPainting"
      @pointerup="stopPainting"
      @pointerleave="stopPainting"
      @contextmenu.prevent
    >
      <div class="cells" :style="gridStyle">
        <button
          v-for="(cell, index) in cells"
          :key="index"
          type="button"
          class="cell unstyled"
          :class="{ 'panel-edge': index % COMPOSITION_WIDTH !== 0 && index % PANEL === 0 }"
          :style="{ background: PALETTE_11[cell].hex }"
          :aria-label="`Pixel ${(index % COMPOSITION_WIDTH) + 1}, ${
            Math.floor(index / COMPOSITION_WIDTH) + 1
          }`"
          @pointerdown="apply(index)"
          @pointerenter="paintIfDown(index)"
        ></button>
      </div>
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
]

// White ground: the composition is drawn onto the page, not out of the dark.
const WHITE = 1

const cells = ref(Array(COMPOSITION_WIDTH * COMPOSITION_HEIGHT).fill(WHITE))
const activeColor = ref(0)
const scale = ref(SCALES[SCALES.length - 1])
const tool = ref('pencil')
const painting = ref(false)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${COMPOSITION_WIDTH}, minmax(0, 1fr))`,
}))

const paint = (index) => {
  // Assigning through the array keeps a single reactive write per cell.
  if (cells.value[index] === activeColor.value) return

  const next = cells.value.slice()
  next[index] = activeColor.value
  cells.value = next
}
/* Flood the contiguous run of whatever colour was clicked, four-connected. */
const fill = (start) => {
  const target = cells.value[start]
  if (target === activeColor.value) return

  const next = cells.value.slice()
  const stack = [start]

  while (stack.length) {
    const index = stack.pop()
    if (next[index] !== target) continue

    next[index] = activeColor.value

    const x = index % COMPOSITION_WIDTH
    const y = Math.floor(index / COMPOSITION_WIDTH)

    if (x > 0) stack.push(index - 1)
    if (x < COMPOSITION_WIDTH - 1) stack.push(index + 1)
    if (y > 0) stack.push(index - COMPOSITION_WIDTH)
    if (y < COMPOSITION_HEIGHT - 1) stack.push(index + COMPOSITION_WIDTH)
  }

  cells.value = next
}

const apply = (index) => (tool.value === 'fill' ? fill(index) : paint(index))

const startPainting = () => (painting.value = true)
const stopPainting = () => (painting.value = false)
const paintIfDown = (index) => {
  // Dragging only makes sense for the pencil; fill is a single decision.
  if (painting.value && tool.value === 'pencil') paint(index)
}

const clear = () => {
  cells.value = Array(COMPOSITION_WIDTH * COMPOSITION_HEIGHT).fill(WHITE)
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

  cells.value.forEach((cell, index) => {
    const hex = PALETTE_11[cell].hex
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
  gap: var(--spacer-sm);

  h1 {
    @mixin ui-font;
    font-size: clamp(2rem, 6cqw, 3rem);
    letter-spacing: var(--letter-spacing-sm);
    line-height: 1;
  }

  .summary {
    max-width: 32rem;
    color: var(--muted);
  }
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
  gap: var(--spacer-xs);
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
  /* The artwork is the only thing here; let it fill the frame. */
  touch-action: none;
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
}

.cell {
  padding: 0;
  border: 0;
  border-radius: 0;
  cursor: crosshair;

  /* Placing a pixel shouldn't leave the browser's focus ring behind it. */
  &:focus {
    outline: none;
  }

  /* Keyboard focus still needs to be visible.  */
  &:focus-visible {
    outline: 2px solid var(--color);
    outline-offset: -2px;
  }
  /*
   * A hairline every 11 columns: three 11x11 panels, not one long strip.
   * Mid grey so it stays legible over both ends of the palette.
   */
  &.panel-edge {
    box-shadow: inset 1px 0 0 var(--gray-z-5);
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
