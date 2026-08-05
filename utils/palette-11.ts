/**
 * The 11x11 palette.
 *
 * Sampled from the set's own artwork rather than transcribed: every PNG across
 * the six editions and the dynamic set resolves to these eleven values, with a
 * clear gap between them (tens of thousands of pixels each) and the handful of
 * anti-aliasing artifacts below them (tens of pixels each).
 */
export const PALETTE_11 = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Green', hex: '#00c853' },
  { name: 'Lime', hex: '#aeea00' },
  { name: 'Yellow', hex: '#ffd60a' },
  { name: 'Orange', hex: '#ff9500' },
  { name: 'Red', hex: '#ff3b30' },
  { name: 'Pink', hex: '#ff2d95' },
  { name: 'Purple', hex: '#af52de' },
  { name: 'Blue', hex: '#007aff' },
  { name: 'Cyan', hex: '#00c7ff' },
] as const

/** Three 11x11 panels side by side. */
export const COMPOSITION_WIDTH = 33
export const COMPOSITION_HEIGHT = 11
export const PANEL = 11
