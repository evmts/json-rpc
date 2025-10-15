import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns information about a transaction by block hash and transaction index position.
 *
 * @example
 * Block hash: "0xbf137c3a7a1ebdfac21252765e5d7f40d115c2757e4a4abee929be88c624fdb7"
 * Transaction index: "0x2"
 * Result: ...
 *
 * Implements the `eth_getTransactionByBlockHashAndIndex` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getTransactionByBlockHashAndIndex' as const

/**
 * Parameters for `eth_getTransactionByBlockHashAndIndex`
 */
export interface Params {
  /** 32 byte hex value */
  block hash: Hash

  /** hex encoded unsigned integer */
  transaction index: Quantity
}

/**
 * Result for `eth_getTransactionByBlockHashAndIndex`
 */
export type Result = Quantity
