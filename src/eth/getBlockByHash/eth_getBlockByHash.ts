import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns information about a block by hash.
 *
 * @example
 * Block hash: "0xd5f1812548be429cbdc6376b29611fc49e06f1359758c4ceaaa3b393e2239f9c"
 * Hydrated transactions: false
 * Result: ...
 *
 * Implements the `eth_getBlockByHash` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getBlockByHash' as const

/**
 * Parameters for `eth_getBlockByHash`
 */
export interface Params {
  /** 32 byte hex value */
  block hash: Hash

  /** hydrated */
  hydrated transactions: Quantity
}

/**
 * Result for `eth_getBlockByHash`
 */
export type Result = Quantity
