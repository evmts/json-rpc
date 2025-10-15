import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Executes a new message call immediately without creating a transaction on the block chain.
 *
 * @example
 * Transaction: ...
 * Block: "latest"
 * Result: "0x"
 *
 * Implements the `eth_call` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_call' as const

/**
 * Parameters for `eth_call`
 */
export interface Params {
  /** Transaction object generic to all types */
  transaction: Quantity

  /** Block number, tag, or block hash */
  block: BlockSpec
}

/**
 * Result for `eth_call`
 *
 * hex encoded bytes
 */
export type Result = Quantity
