import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Transaction fee history
 *
 * @example
 * blockCount: "0x5"
 * newestblock: "latest"
 * rewardPercentiles: ...
 * Result: ...
 *
 * Implements the `eth_feeHistory` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_feeHistory' as const

/**
 * Parameters for `eth_feeHistory`
 */
export interface Params {
  /** hex encoded unsigned integer */
  blockcount: Quantity

  /** Block number or tag */
  newestblock: Quantity

  /** rewardPercentiles */
  rewardpercentiles: Quantity
}

/**
 * Result for `eth_feeHistory`
 *
 * feeHistoryResults
 */
export type Result = Quantity
