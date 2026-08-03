import { computed, onBeforeUnmount, onMounted, ref, toValue, watch } from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

export type VirtualGridOptions = {
  /** The grid element itself (renders only the visible window of items). */
  content: Ref<HTMLElement | null | undefined>
  /** Scroll container. Defaults to the page viewport. */
  viewport?: Ref<HTMLElement | null | undefined>
  /** Total number of items in the (unrendered) list. */
  count: MaybeRefOrGetter<number>
  /** Minimum tile width in pixels, used to derive the column count. */
  minTileWidth?: MaybeRefOrGetter<number>
  /** Fixed column count. Overrides `minTileWidth` when set. */
  columns?: MaybeRefOrGetter<number | null>
  /** Tile aspect ratio (width / height). */
  aspectRatio?: MaybeRefOrGetter<number>
  /** Extra rows rendered above and below the viewport. */
  overscanRows?: number
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/**
 * Renders large grids without paying for the whole list.
 *
 * Only the rows intersecting the viewport (plus a small overscan) are kept in
 * the DOM; the rest of the scroll height is held open with padding, so scroll
 * position, scrollbars and drop targets all behave like a full grid would.
 */
export const useVirtualGrid = ({
  content,
  viewport,
  count,
  minTileWidth = 96,
  columns: fixedColumns,
  aspectRatio = 1,
  overscanRows = 4,
}: VirtualGridOptions) => {
  const columns = ref(1)
  const tileHeight = ref(0)
  const gap = ref(0)
  const start = ref(0)
  const end = ref(0)
  const padTop = ref(0)
  const padBottom = ref(0)

  let contentWidth = 0
  let frame: number | null = null
  let observer: ResizeObserver | null = null

  const measure = () => {
    const el = content.value
    if (!el) return

    const style = getComputedStyle(el)
    gap.value = parseFloat(style.rowGap) || 0
    contentWidth =
      el.clientWidth -
      (parseFloat(style.paddingLeft) || 0) -
      (parseFloat(style.paddingRight) || 0)
  }

  const update = () => {
    const el = content.value
    if (!el || typeof window === 'undefined') return

    measure()

    const total = Math.max(0, toValue(count))
    const override = toValue(fixedColumns) || null
    const tileMin = Math.max(1, toValue(minTileWidth))

    columns.value =
      override || Math.max(1, Math.floor((contentWidth + gap.value) / (tileMin + gap.value)))

    const tileWidth = (contentWidth - gap.value * (columns.value - 1)) / columns.value
    tileHeight.value = Math.max(1, tileWidth / (toValue(aspectRatio) || 1))

    const rowHeight = tileHeight.value + gap.value
    const rows = Math.ceil(total / columns.value)

    if (!rows) {
      start.value = 0
      end.value = 0
      padTop.value = 0
      padBottom.value = 0
      return
    }

    const rect = el.getBoundingClientRect()
    const scroller = viewport?.value
    const scrollerRect = scroller?.getBoundingClientRect()
    const viewTop = scrollerRect ? scrollerRect.top : 0
    const viewHeight = scroller ? scroller.clientHeight : window.innerHeight

    // Distance between the top of the grid and the top of the viewport.
    const offset = viewTop - rect.top

    const firstRow = clamp(Math.floor(offset / rowHeight) - overscanRows, 0, rows - 1)
    const lastRow = clamp(
      Math.ceil((offset + viewHeight) / rowHeight) + overscanRows,
      firstRow,
      rows - 1,
    )

    start.value = firstRow * columns.value
    end.value = Math.min(total, (lastRow + 1) * columns.value)
    padTop.value = firstRow * rowHeight
    padBottom.value = Math.max(0, (rows - 1 - lastRow) * rowHeight)
  }

  const schedule = () => {
    if (frame !== null) return

    frame = requestAnimationFrame(() => {
      frame = null
      update()
    })
  }

  const observe = () => {
    if (typeof ResizeObserver === 'undefined') return

    observer?.disconnect()
    observer = new ResizeObserver(schedule)
    // Border box: the grid's padding holds the full scroll height open, so its
    // outer size only changes when the list or the layout does.
    if (content.value) observer.observe(content.value, { box: 'border-box' })
    if (viewport?.value) observer.observe(viewport.value)
  }

  // The elements may only exist (or only be laid out) after the first render.
  watch(
    [content, () => viewport?.value],
    () => {
      observe()
      update()
    },
    { flush: 'post' },
  )

  onMounted(() => {
    observe()
    update()
    requestAnimationFrame(update)

    // `capture` so scrolling in any ancestor container updates the window.
    window.addEventListener('scroll', schedule, { passive: true, capture: true })
    window.addEventListener('resize', schedule, { passive: true })
  })

  onBeforeUnmount(() => {
    if (frame !== null) cancelAnimationFrame(frame)
    observer?.disconnect()
    window.removeEventListener('scroll', schedule, { capture: true } as EventListenerOptions)
    window.removeEventListener('resize', schedule)
  })

  watch(
    () => [toValue(count), toValue(aspectRatio), toValue(fixedColumns), toValue(minTileWidth)],
    schedule,
  )

  /** Bind to the grid element: fixes the columns and holds the scroll height open. */
  const style = computed(() => ({
    gridTemplateColumns: `repeat(${columns.value}, minmax(0, 1fr))`,
    gridAutoRows: `${tileHeight.value}px`,
    paddingTop: `${padTop.value}px`,
    paddingBottom: `${padBottom.value}px`,
  }))

  return {
    columns,
    tileHeight,
    gap,
    start,
    end,
    style,
    update,
  }
}
