import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the balance of the account of given address.
 *
 * @example
 * Address: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
 * Block: "latest"
 * Result: "0x1cfe56f3795885980000"
 *
 * Implements the `eth_getBalance` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getBalance' as const

/**
 * Parameters for `eth_getBalance`
 */
export interface Params {
  /** hex encoded address */
  address: Address

  /** Block number, tag, or block hash */
  block: BlockSpec
}

/**
 * Result for `eth_getBalance`
 *
 * hex encoded unsigned integer
 */
export type Result = Quantity
