import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the number of transactions in a block matching the given block number.
 *
 * @example
 * Block: "0xe8"
 * Result: "0x1"
 *
 * Implements the `eth_getUncleCountByBlockNumber` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getUncleCountByBlockNumber' as const

/**
 * Parameters for `eth_getUncleCountByBlockNumber`
 */
export interface Params {
  /** Block number or tag */
  block: Quantity
}

/**
 * Result for `eth_getUncleCountByBlockNumber`
 */
export type Result = Quantity
