import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the base fee per blob gas in wei.
 *
 * @example
 * Result: "0x3f5694c1f"
 *
 * Implements the `eth_blobBaseFee` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_blobBaseFee' as const

/**
 * Parameters for `eth_blobBaseFee`
 */
export interface Params {
}

/**
 * Result for `eth_blobBaseFee`
 *
 * Blob gas base fee
 */
export type Result = Quantity
