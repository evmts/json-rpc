import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the number of most recent block.
 *
 * @example
 * Result: "0x2377"
 *
 * Implements the `eth_blockNumber` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_blockNumber' as const

/**
 * Parameters for `eth_blockNumber`
 */
export interface Params {
}

/**
 * Result for `eth_blockNumber`
 *
 * hex encoded unsigned integer
 */
export type Result = Quantity
