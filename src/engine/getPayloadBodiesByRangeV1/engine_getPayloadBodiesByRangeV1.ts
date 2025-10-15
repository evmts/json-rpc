import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Given a range of block numbers returns bodies of the corresponding execution payloads
 *
 * @example
 * Starting block number: "0x20"
 * Number of blocks to return: "0x2"
 * Result: ...
 *
 * Implements the `engine_getPayloadBodiesByRangeV1` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_getPayloadBodiesByRangeV1' as const

/**
 * Parameters for `engine_getPayloadBodiesByRangeV1`
 */
export interface Params {
  /** hex encoded 64 bit unsigned integer */
  starting block number: Quantity

  /** hex encoded 64 bit unsigned integer */
  number of blocks to return: Quantity
}

/**
 * Result for `engine_getPayloadBodiesByRangeV1`
 */
export type Result = Quantity
