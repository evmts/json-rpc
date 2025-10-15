import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Fetches blobs from the blob pool
 *
 * @example
 * Blob versioned hashes: ...
 * Result: ...
 *
 * Implements the `engine_getBlobsV1` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_getBlobsV1' as const

/**
 * Parameters for `engine_getBlobsV1`
 */
export interface Params {
  blob versioned hashes: Quantity
}

/**
 * Result for `engine_getBlobsV1`
 */
export type Result = Quantity
