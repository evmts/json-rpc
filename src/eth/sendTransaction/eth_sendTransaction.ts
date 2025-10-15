import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Signs and submits a transaction.
 *
 * @example
 * Transaction: ...
 * Result: "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331"
 *
 * Implements the `eth_sendTransaction` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_sendTransaction' as const

/**
 * Parameters for `eth_sendTransaction`
 */
export interface Params {
  /** Transaction object generic to all types */
  transaction: Quantity
}

/**
 * Result for `eth_sendTransaction`
 *
 * 32 byte hex value
 */
export type Result = Hash
