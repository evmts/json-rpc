import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the receipt of a transaction by transaction hash.
 *
 * @example
 * Transaction hash: "0x504ce587a65bdbdb6414a0c6c16d86a04dd79bfcc4f2950eec9634b30ce5370f"
 * Result: ...
 *
 * Implements the `eth_getTransactionReceipt` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getTransactionReceipt' as const

/**
 * Parameters for `eth_getTransactionReceipt`
 */
export interface Params {
  /** 32 byte hex value */
  transaction hash: Hash
}

/**
 * Result for `eth_getTransactionReceipt`
 */
export type Result = Quantity
