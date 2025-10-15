import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Fetch blobs from the blob mempool
 *
 * @example
 * Blob versioned hashes: ...
 * Result: ...
 *
 * Implements the `engine_getBlobsV2` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_getBlobsV2' as const

/**
 * Parameters for `engine_getBlobsV2`
 */
export interface Params {
  blob versioned hashes: Quantity
}

/**
 * Result for `engine_getBlobsV2`
 */
export type Result = Quantity
