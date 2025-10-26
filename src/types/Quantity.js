/**
 * @fileoverview Hex-encoded quantity type definition with validation
 *
 * Uses @tevm/primitives for type compatibility across the ecosystem.
 */

import { InvalidParamsError } from './JsonRpcError.js'

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
 * **Important**: Always use `isQuantity()` to check if a value is a valid quantity before using `Quantity()`.
 * The `Quantity()` function will throw an `InvalidParamsError` if the input is invalid.
 *
 * **Note**: Compatible with `@tevm/primitives/ethereum-types` Uint, Uint64, and Uint256 types.
 *
 * @typedef {Hex & { readonly __brand: 'Quantity' }} Quantity
 * @see https://github.com/ethereum/execution-apis
 */

/**
 * Type guard to check if a value is a valid quantity.
 *
 * Use this function to safely check if a hex string is a valid quantity before
 * casting it with the `Quantity()` function.
 *
 * @param {unknown} quantity - Value to check
 * @returns {quantity is Quantity} True if the value is a valid Quantity
 *
 * @example
 * ```js
 * const qty = '0x1a'
 * if (isQuantity(qty)) {
 *   // TypeScript/JSDoc knows qty is Quantity type here
 *   console.log(qty)  // Represents 26 in decimal
 * }
 * ```
 */
export function isQuantity(quantity) {
  return (
    typeof quantity === 'string' &&
    /^0x(0|[1-9a-f][0-9a-f]*)$/.test(quantity)
  )
}

/**
 * Creates a validated Quantity from a hex string.
 *
 * **Warning**: This function throws if the input is invalid. Use `isQuantity()` to check
 * validity before calling this function.
 *
 * @param {`0x${string}`} quantity - Hex string representing an unsigned integer (no leading zeros except "0x0")
 * @returns {Quantity} Validated Quantity
 * @throws {import('./JsonRpcError.js').InvalidParamsError} If not a valid quantity
 *
 * @example
 * ```js
 * // Good: Check before using
 * const qty = '0x1a'
 * if (isQuantity(qty)) {
 *   const validQty = Quantity(qty)  // 26 in decimal
 * }
 *
 * // Also good: Catch the error
 * try {
 *   const qty = Quantity('0x0')  // Valid: zero
 *   const qty2 = Quantity('0x1a')  // Valid: 26
 *   const bad = Quantity('0x00')  // Throws: leading zero not allowed
 * } catch (err) {
 *   console.error(`${err.name} (${err.code}): ${err.message}`)
 * }
 * ```
 */
export const Quantity = (quantity) => {
  if (!isQuantity(quantity)) {
    throw InvalidParamsError(
      `Invalid quantity: expected lowercase hex string with no leading zeros (0x0 or 0x[1-9a-f][0-9a-f]*), got "${quantity}"`
    )
  }
  return /** @type {Quantity} */ (quantity)
}
