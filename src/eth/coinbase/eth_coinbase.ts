import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the client coinbase address.
 *
 * @example
 * Result: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
 *
 * Implements the `eth_coinbase` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_coinbase' as const

/**
 * Parameters for `eth_coinbase`
 */
export interface Params {
}

/**
 * Result for `eth_coinbase`
 *
 * hex encoded address
 */
export type Result = Address
