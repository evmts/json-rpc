import type { Hex } from './Hex.js'

/**
 * Hex-encoded unsigned integer quantity.
 *
 * Pattern: `^0x(0|[1-9a-f][0-9a-f]*)$`
 *
 * Note: Quantities are encoded as hex strings with no leading zeros, except for zero itself which is "0x0".
 *
 * @see https://github.com/ethereum/execution-apis
 */
export type Quantity = Hex & { readonly __brand: 'Quantity' }

/**
 * Creates a validated Quantity from a hex string.
 *
 * @param quantity - Hex string representing an unsigned integer (no leading zeros except "0x0")
 * @returns Validated Quantity
 * @throws Error if not a valid quantity
 *
 * @example
 * ```ts
 * const qty = Quantity('0x1a')  // 26 in decimal
 * const zero = Quantity('0x0')  // 0
 * ```
 */
export const Quantity = (quantity: `0x${string}`): Quantity => {
  if (!/^0x(0|[1-9a-f][0-9a-f]*)$/.test(quantity)) {
    throw new Error(`Invalid quantity: ${quantity}`)
  }
  return quantity as Quantity
}
