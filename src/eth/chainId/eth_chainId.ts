import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the chain ID of the current network.
 *
 * @example
 * Result: "0x1"
 *
 * Implements the `eth_chainId` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_chainId' as const

/**
 * Parameters for `eth_chainId`
 */
export interface Params {
}

/**
 * Result for `eth_chainId`
 *
 * hex encoded unsigned integer
 */
export type Result = Quantity
