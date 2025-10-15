import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the number of uncles in a block from a block matching the given block hash.
 *
 * @example
 * Block hash: "0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35"
 * Result: "0x1"
 *
 * Implements the `eth_getUncleCountByBlockHash` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getUncleCountByBlockHash' as const

/**
 * Parameters for `eth_getUncleCountByBlockHash`
 */
export interface Params {
  /** 32 byte hex value */
  block hash: Hash
}

/**
 * Result for `eth_getUncleCountByBlockHash`
 */
export type Result = Quantity
