import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns an array of EIP-2718 binary-encoded receipts.
 *
 * @example
 * Block: "0x32026E"
 * Result: ...
 *
 * Implements the `debug_getRawReceipts` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'debug_getRawReceipts' as const

/**
 * Parameters for `debug_getRawReceipts`
 */
export interface Params {
  /** Block number or tag */
  block: Quantity
}

/**
 * Result for `debug_getRawReceipts`
 *
 * Receipt array
 */
export type Result = Quantity
