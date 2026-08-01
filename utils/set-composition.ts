import { EDITION_KEYS } from './editions'
import type { Image, SetSubmission } from './types'

export type CompositionLocation =
  | { type: 'pool' }
  | { type: 'slot'; edition: number; index: number }

export type CompositionSlots = Record<number, Array<Image | null>>

export type CompositionChange = {
  edition: number
  index: number
  image: Image | null
}

type CompositionSubmission = SetSubmission & {
  dynamicSetImages?: Record<string, Image | null | undefined>
}

const isDynamic = (submission: CompositionSubmission) => submission.edition_type === 'DYNAMIC'

const imageProperty = (edition: number) =>
  `edition${edition}Image` as keyof CompositionSubmission

export const createCompositionSlots = (submission: CompositionSubmission): CompositionSlots =>
  Object.fromEntries(
    EDITION_KEYS.map((edition) => {
      const slotCount = isDynamic(submission) ? edition : 1
      const images = Array.from({ length: slotCount }, (_, offset) => {
        if (!isDynamic(submission) || edition === 1) {
          return (submission[imageProperty(edition)] as Image | null | undefined) || null
        }

        return submission.dynamicSetImages?.[`image${edition}_${offset + 1}`] || null
      })

      return [edition, images]
    }),
  )

export const selectedCompositionImageUuids = (slots: CompositionSlots) =>
  new Set(
    Object.values(slots)
      .flat()
      .flatMap((image) => (image?.uuid ? [image.uuid] : [])),
  )

const sameSlot = (first: CompositionLocation, second: CompositionLocation) =>
  first.type === 'slot' &&
  second.type === 'slot' &&
  first.edition === second.edition &&
  first.index === second.index

const setSlot = (
  slots: CompositionSlots,
  location: CompositionLocation,
  image: Image | null,
  changes: CompositionChange[],
) => {
  if (location.type !== 'slot') return

  slots[location.edition][location.index - 1] = image
  changes.push({ ...location, image })
}

export const applyCompositionDrop = ({
  slots,
  image,
  from,
  to,
}: {
  slots: CompositionSlots
  image: Image
  from: CompositionLocation
  to: CompositionLocation
}) => {
  if (sameSlot(from, to) || (from.type === 'pool' && to.type === 'pool')) {
    return { slots, changes: [] }
  }

  const nextSlots = Object.fromEntries(
    Object.entries(slots).map(([edition, images]) => [edition, [...images]]),
  ) as CompositionSlots
  const changes: CompositionChange[] = []

  if (to.type === 'pool') {
    setSlot(nextSlots, from, null, changes)
    return { slots: nextSlots, changes }
  }

  const displacedImage = nextSlots[to.edition][to.index - 1]
  setSlot(nextSlots, to, image, changes)

  if (from.type === 'slot') {
    setSlot(nextSlots, from, displacedImage, changes)
  }

  return { slots: nextSlots, changes }
}

export const createCompositionUpdateBody = ({
  submission,
  changes,
  participationId,
}: {
  submission: CompositionSubmission
  changes: CompositionChange[]
  participationId?: number
}) => {
  const body: Record<string, unknown> = {}

  if (participationId) body.participationId = participationId

  if (isDynamic(submission)) {
    body.images = changes.map(({ edition, index, image }) => ({
      edition,
      index,
      uuid: image?.uuid || null,
    }))
  } else {
    for (const { edition, image } of changes) {
      body[`edition_${edition}ImageId`] = image?.uuid || null
    }
  }

  return body
}
