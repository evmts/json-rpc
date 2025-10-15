import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns an RLP encoded transaction signed by the specified account.
 *
 * @example
 * Transaction: ...
 * Result: "0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b"
 *
 * Implements the `eth_signTransaction` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_signTransaction' as const

/**
 * Parameters for `eth_signTransaction`
 */
export interface Params {
  /** Transaction object generic to all types */
  transaction: Quantity
}

/**
 * Result for `eth_signTransaction`
 *
 * hex encoded bytes
 */
export type Result = Quantity
