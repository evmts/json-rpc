import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the receipts of a block by number or hash.
 *
 * @example
 * Block: "latest"
 * Result: ...
 *
 * Implements the `eth_getBlockReceipts` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getBlockReceipts' as const

/**
 * Parameters for `eth_getBlockReceipts`
 */
export interface Params {
  /** Block number, tag, or block hash */
  block: BlockSpec
}

/**
 * Result for `eth_getBlockReceipts`
 */
export type Result = Quantity
