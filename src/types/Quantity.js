/**
 * @fileoverview Hex-encoded quantity type definition with validation
 */

/**
 * @typedef {import('./Hex.js').Hex} Hex
 */

/**
 * Hex-encoded unsigned integer quantity.
 *
 * Pattern: `^0x(0|[1-9a-f][0-9a-f]*)$`
 *
 * Note: Quantities are encoded as hex strings with no leading zeros, except for zero itself which is "0x0".
 *
 * @typedef {Hex & { readonly __brand: 'Quantity' }} Quantity
 * @see https://github.com/ethereum/execution-apis
 */

/**
 * Creates a validated Quantity from a hex string.
 *
 * @param {`0x${string}`} quantity - Hex string representing an unsigned integer (no leading zeros except "0x0")
 * @returns {Quantity} Validated Quantity
 * @throws {Error} If not a valid quantity
 *
 * @example
 * ```js
 * const qty = Quantity('0x1a')  // 26 in decimal
 * const zero = Quantity('0x0')  // 0
 * ```
 */
export const Quantity = (quantity) => {
  if (!/^0x(0|[1-9a-f][0-9a-f]*)$/.test(quantity)) {
    throw new Error(`Invalid quantity: ${quantity}`)
  }
  return /** @type {Quantity} */ (quantity)
}
