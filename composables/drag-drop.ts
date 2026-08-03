import { onBeforeUnmount, ref, watch } from 'vue'
import type { Ref } from 'vue'

export type DragDropEvent = {
  item: HTMLElement
  from: HTMLElement | null
  to: HTMLElement
}

export type DragDropOptions = {
  /** Root element containing the draggable items and the drop zones. */
  root: Ref<HTMLElement | null | undefined>
  /** Selector for draggable items. */
  itemSelector?: string
  /** Selector for drop zones. */
  zoneSelector?: string
  /** Called once a piece is released over a drop zone. */
  onDrop: (event: DragDropEvent) => void
}

const MOUSE_THRESHOLD = 4
const TOUCH_THRESHOLD = 12
const TOUCH_HOLD = 180
const EDGE_SIZE = 72
const EDGE_SPEED = 22

const isScrollable = (el: HTMLElement) => {
  const style = getComputedStyle(el)

  return /(auto|scroll|overlay)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1
}

const scrollableUnder = (el: Element | null): HTMLElement | null => {
  let node = el as HTMLElement | null

  while (node && node !== document.body) {
    if (isScrollable(node)) return node
    node = node.parentElement
  }

  return null
}

/**
 * Pointer driven drag and drop.
 *
 * Targets are resolved by hit testing the element under the pointer, so a piece
 * always lands in the zone it visually hovers — no proximity heuristics, no
 * source list mutation, and one shared set of listeners regardless of how many
 * zones are on screen. Works with mouse, pen and touch (hold to lift).
 */
export const useDragAndDrop = ({
  root,
  itemSelector = '[data-drag-item]',
  zoneSelector = '[data-drop-zone]',
  onDrop,
}: DragDropOptions) => {
  const dragging = ref(false)

  let pointerId: number | null = null
  let pointerType = 'mouse'
  let item: HTMLElement | null = null
  let fromZone: HTMLElement | null = null
  let hovered: HTMLElement | null = null
  let ghost: HTMLElement | null = null
  let baseSize = { width: 0, height: 0 }
  let ghostSize = { width: 0, height: 0 }
  let grabRatio = { x: 0.5, y: 0.5 }
  let origin = { x: 0, y: 0 }
  let point = { x: 0, y: 0 }
  let holdTimer: ReturnType<typeof setTimeout> | null = null
  let scrollFrame: number | null = null
  let started = false

  const positionGhost = () => {
    if (!ghost) return

    ghost.style.transform = `translate3d(${point.x - grabRatio.x * ghostSize.width}px, ${
      point.y - grabRatio.y * ghostSize.height
    }px, 0)`
  }

  /** Shrink the ghost to the hovered zone so it never hides its own target. */
  const fitGhost = (zone: HTMLElement | null) => {
    if (!ghost) return

    const rect = zone?.getBoundingClientRect()
    const width = rect ? Math.min(baseSize.width, rect.width) : baseSize.width
    const height = rect ? Math.min(baseSize.height, rect.height) : baseSize.height

    if (width === ghostSize.width && height === ghostSize.height) return

    ghostSize = { width, height }
    ghost.style.width = `${width}px`
    ghost.style.height = `${height}px`
  }

  const setHovered = (zone: HTMLElement | null) => {
    if (zone === hovered) return

    hovered?.classList.remove('is-drop-target')
    hovered = zone
    hovered?.classList.add('is-drop-target')
    fitGhost(zone)
  }

  const updateHovered = () => {
    const element = document.elementFromPoint(point.x, point.y)

    setHovered((element?.closest(zoneSelector) as HTMLElement) || null)
  }

  const autoScroll = () => {
    scrollFrame = requestAnimationFrame(autoScroll)
    if (!started) return

    const scroller = scrollableUnder(document.elementFromPoint(point.x, point.y))
    let scrolled = false

    if (scroller) {
      const rect = scroller.getBoundingClientRect()
      const top = point.y - rect.top
      const bottom = rect.bottom - point.y

      if (top < EDGE_SIZE && scroller.scrollTop > 0) {
        scroller.scrollTop -= Math.ceil(((EDGE_SIZE - top) / EDGE_SIZE) * EDGE_SPEED)
        scrolled = true
      } else if (
        bottom < EDGE_SIZE &&
        scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight
      ) {
        scroller.scrollTop += Math.ceil(((EDGE_SIZE - bottom) / EDGE_SIZE) * EDGE_SPEED)
        scrolled = true
      }
    }

    if (!scrolled) {
      const bottom = window.innerHeight - point.y

      if (point.y < EDGE_SIZE) {
        window.scrollBy(0, -Math.ceil(((EDGE_SIZE - point.y) / EDGE_SIZE) * EDGE_SPEED))
        scrolled = true
      } else if (bottom < EDGE_SIZE) {
        window.scrollBy(0, Math.ceil(((EDGE_SIZE - bottom) / EDGE_SIZE) * EDGE_SPEED))
        scrolled = true
      }
    }

    if (scrolled) updateHovered()
  }

  const lift = () => {
    if (started || !item) return

    started = true
    dragging.value = true

    const rect = item.getBoundingClientRect()

    ghost = item.cloneNode(true) as HTMLElement
    ghost.removeAttribute('id')
    ghost.classList.add('drag-ghost')
    Object.assign(ghost.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      margin: '0',
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      pointerEvents: 'none',
      zIndex: '2147483000',
      opacity: '0.95',
      boxShadow: '0 1rem 2rem rgba(0, 0, 0, 0.45)',
      cursor: 'grabbing',
      willChange: 'transform',
      transition: 'width 120ms ease, height 120ms ease',
    })

    baseSize = { width: rect.width, height: rect.height }
    ghostSize = { ...baseSize }
    grabRatio = {
      x: rect.width ? (point.x - rect.left) / rect.width : 0.5,
      y: rect.height ? (point.y - rect.top) / rect.height : 0.5,
    }
    document.body.appendChild(ghost)
    positionGhost()

    item.classList.add('is-dragging-source')
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'

    updateHovered()
    if (scrollFrame === null) scrollFrame = requestAnimationFrame(autoScroll)
  }

  const preventTouchScroll = (event: TouchEvent) => {
    if (started) event.preventDefault()
  }

  const suppressNextClick = () => {
    const handler = (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
    }

    window.addEventListener('click', handler, { capture: true, once: true })
    setTimeout(() => window.removeEventListener('click', handler, { capture: true }), 350)
  }

  const teardown = () => {
    if (holdTimer) clearTimeout(holdTimer)
    if (scrollFrame !== null) cancelAnimationFrame(scrollFrame)

    holdTimer = null
    scrollFrame = null

    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onCancel)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('touchmove', preventTouchScroll)

    ghost?.remove()
    ghost = null

    item?.classList.remove('is-dragging-source')
    setHovered(null)

    document.body.style.removeProperty('user-select')
    document.body.style.removeProperty('cursor')

    item = null
    fromZone = null
    pointerId = null
    started = false
    dragging.value = false
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return

    const wasDragging = started
    teardown()
    if (wasDragging) suppressNextClick()
  }

  const onCancel = () => teardown()

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return

    point = { x: event.clientX, y: event.clientY }
    const distance = Math.hypot(point.x - origin.x, point.y - origin.y)

    if (!started) {
      // A touch that moves before the hold completes is a scroll, not a drag.
      if (pointerType === 'touch') {
        if (distance > TOUCH_THRESHOLD) teardown()
        return
      }

      if (distance < MOUSE_THRESHOLD) return
      lift()
    }

    event.preventDefault()
    positionGhost()
    updateHovered()
  }

  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return

    const droppedItem = item
    const droppedFrom = fromZone
    const droppedTo = hovered
    const wasDragging = started

    teardown()

    if (!wasDragging || !droppedItem || !droppedTo) return

    suppressNextClick()
    if (droppedTo !== droppedFrom)
      onDrop({ item: droppedItem, from: droppedFrom, to: droppedTo })
  }

  const onPointerDown = (event: PointerEvent) => {
    if (pointerId !== null) return
    if (event.button > 0) return

    const target = (event.target as Element | null)?.closest?.(
      itemSelector,
    ) as HTMLElement | null
    if (!target || !root.value?.contains(target)) return
    if ((event.target as Element).closest('[data-no-drag]')) return

    pointerId = event.pointerId
    pointerType = event.pointerType
    item = target
    fromZone = target.closest(zoneSelector)
    origin = { x: event.clientX, y: event.clientY }
    point = { ...origin }
    started = false

    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onCancel)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchmove', preventTouchScroll, { passive: false })

    if (pointerType === 'touch') holdTimer = setTimeout(lift, TOUCH_HOLD)
  }

  const onDragStart = (event: Event) => {
    // Never let the browser's native image dragging take over.
    if ((event.target as Element | null)?.closest?.(itemSelector)) event.preventDefault()
  }

  // Bound off the ref rather than on mount: the root element may only be
  // available after the first client render.
  watch(
    root,
    (element, previous) => {
      previous?.removeEventListener('pointerdown', onPointerDown)
      previous?.removeEventListener('dragstart', onDragStart)
      element?.addEventListener('pointerdown', onPointerDown)
      element?.addEventListener('dragstart', onDragStart)
    },
    { immediate: true, flush: 'post' },
  )

  onBeforeUnmount(() => {
    root.value?.removeEventListener('pointerdown', onPointerDown)
    root.value?.removeEventListener('dragstart', onDragStart)
    teardown()
  })

  return { dragging }
}
