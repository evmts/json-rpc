import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns information about a transaction by block number and transaction index position.
 *
 * @example
 * Block: "0x1442e"
 * Transaction index: "0x2"
 * Result: ...
 *
 * Implements the `eth_getTransactionByBlockNumberAndIndex` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getTransactionByBlockNumberAndIndex' as const

/**
 * Parameters for `eth_getTransactionByBlockNumberAndIndex`
 */
export interface Params {
  /** Block number or tag */
  block: Quantity

  /** hex encoded unsigned integer */
  transaction index: Quantity
}

/**
 * Result for `eth_getTransactionByBlockNumberAndIndex`
 */
export type Result = Quantity
