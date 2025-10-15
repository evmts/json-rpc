import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the information about a transaction requested by transaction hash.
 *
 * @example
 * Transaction hash: "0xa52be92809541220ee0aaaede6047d9a6c5d0cd96a517c854d944ee70a0ebb44"
 * Result: ...
 *
 * Implements the `eth_getTransactionByHash` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getTransactionByHash' as const

/**
 * Parameters for `eth_getTransactionByHash`
 */
export interface Params {
  /** 32 byte hex value */
  transaction hash: Hash
}

/**
 * Result for `eth_getTransactionByHash`
 */
export type Result = Quantity
