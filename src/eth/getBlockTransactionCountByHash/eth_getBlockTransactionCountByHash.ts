import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the number of transactions in a block from a block matching the given block hash.
 *
 * @example
 * Block hash: "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"
 * Result: "0x8"
 *
 * Implements the `eth_getBlockTransactionCountByHash` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getBlockTransactionCountByHash' as const

/**
 * Parameters for `eth_getBlockTransactionCountByHash`
 */
export interface Params {
  /** 32 byte hex value */
  block hash: Hash
}

/**
 * Result for `eth_getBlockTransactionCountByHash`
 */
export type Result = Quantity
