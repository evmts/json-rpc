/**
 * @fileoverview 32-byte hash type definition with validation
 */

import { JsonRpcError, JsonRpcErrorCode } from './JsonRpcError.js'

/**
 * @typedef {import('./Hex.js').Hex} Hex
 */

/**
 * Hex-encoded 32-byte hash.
 *
 * Pattern: `^0x[0-9a-f]{64}$`
 *
 * **Important**: Always use `isHash()` to check if a value is a valid hash before using `Hash()`.
 * The `Hash()` function will throw a `JsonRpcError` if the input is invalid.
 *
 * @typedef {Hex & { readonly __brand: 'Hash' }} Hash
 * @see https://github.com/ethereum/execution-apis
 */

/**
 * Type guard to check if a value is a valid 32-byte hash.
 *
 * Use this function to safely check if a hex string is a valid hash before
 * casting it with the `Hash()` function.
 *
 * @param {unknown} hash - Value to check
 * @returns {hash is Hash} True if the value is a valid Hash
 *
 * @example
 * ```js
 * const h = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
 * if (isHash(h)) {
 *   // TypeScript/JSDoc knows h is Hash type here
 *   console.log(h)
 * }
 * ```
 */
export function isHash(hash) {
  return (
    typeof hash === 'string' &&
    /^0x[0-9a-f]{64}$/.test(hash)
  )
}

/**
 * Creates a validated Hash from a hex string.
 *
 * **Warning**: This function throws if the input is invalid. Use `isHash()` to check
 * validity before calling this function.
 *
 * @param {`0x${string}`} hash - Hex string (must be exactly 32 bytes / 66 characters including 0x)
 * @returns {Hash} Validated Hash
 * @throws {JsonRpcError} If not a valid hash (code: -32602 Invalid params)
 *
 * @example
 * ```js
 * // Good: Check before using
 * const h = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
 * if (isHash(h)) {
 *   const validHash = Hash(h)
 * }
 *
 * // Also good: Catch the error
 * try {
 *   const hash = Hash('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')
 * } catch (err) {
 *   if (err instanceof JsonRpcError) {
 *     console.error(`Invalid hash: ${err.message}`)
 *   }
 * }
 * ```
 */
export const Hash = (hash) => {
  if (!isHash(hash)) {
    throw new JsonRpcError(
      `Invalid 32-byte hash: expected lowercase hex string (0x followed by 64 hex characters), got "${hash}"`,
      JsonRpcErrorCode.INVALID_PARAMS
    )
  }
  return /** @type {Hash} */ (hash)
}
