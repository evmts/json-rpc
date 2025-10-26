/**
 * @fileoverview Ethereum address type definition with validation
 *
 * Uses @tevm/primitives for type compatibility across the ecosystem.
 */

import { InvalidParamsError } from './JsonRpcError.js'

/**
 * @typedef {import('./Hex.js').Hex} Hex
 */

/**
 * Hex-encoded Ethereum address (20 bytes).
 *
 * Pattern: `^0x[0-9a-fA-F]{40}$`
 *
 * **Important**: Always use `isAddress()` to check if a value is a valid address before using `Address()`.
 * The `Address()` function will throw an `InvalidParamsError` if the input is invalid.
 *
 * **Note**: Compatible with `@tevm/primitives/ethereum-types` Address type.
 *
 * @typedef {Hex & { readonly __brand: 'Address' }} Address
 * @see https://github.com/ethereum/execution-apis
 */

/**
 * Type guard to check if a value is a valid Ethereum address.
 *
 * Use this function to safely check if a hex string is a valid address before
 * casting it with the `Address()` function.
 *
 * @param {unknown} address - Value to check
 * @returns {address is Address} True if the value is a valid Address
 *
 * @example
 * ```js
 * const addr = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0'
 * if (isAddress(addr)) {
 *   // TypeScript/JSDoc knows addr is Address type here
 *   console.log(addr)
 * }
 * ```
 */
export function isAddress(address) {
  return (
    typeof address === 'string' &&
    /^0x[0-9a-fA-F]{40}$/.test(address)
  )
}

/**
 * Creates a validated Address from a hex string.
 *
 * **Warning**: This function throws if the input is invalid. Use `isAddress()` to check
 * validity before calling this function.
 *
 * @param {`0x${string}`} address - Hex string (must be exactly 20 bytes / 42 characters including 0x)
 * @returns {Address} Validated Address
 * @throws {import('./JsonRpcError.js').InvalidParamsError} If not a valid Ethereum address
 *
 * @example
 * ```js
 * // Good: Check before using
 * const addr = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0'
 * if (isAddress(addr)) {
 *   const validAddr = Address(addr)
 * }
 *
 * // Also good: Catch the error
 * try {
 *   const addr = Address('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')
 * } catch (err) {
 *   console.error(`${err.name} (${err.code}): ${err.message}`)
 * }
 * ```
 */
export const Address = (address) => {
  if (!isAddress(address)) {
    throw InvalidParamsError(
      `Invalid Ethereum address: expected 20-byte hex string (0x followed by 40 hex characters), got "${address}"`
    )
  }
  return /** @type {Address} */ (address)
}
