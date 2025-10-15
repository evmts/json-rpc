import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Executes a sequence of message calls building on each other's state without creating transactions on the block chain, optionally overriding block and state data
 *
 * Implements the `eth_simulateV1` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_simulateV1' as const

/**
 * Parameters for `eth_simulateV1`
 */
export interface Params {
  /** Arguments for eth_simulate */
  payload: Quantity

  /** Block number, tag, or block hash */
  block tag: BlockSpec
}

/**
 * Result for `eth_simulateV1`
 *
 * Full results of eth_simulate
 */
export type Result = Quantity
