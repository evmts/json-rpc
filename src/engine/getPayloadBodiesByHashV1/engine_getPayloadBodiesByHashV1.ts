import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Given block hashes returns bodies of the corresponding execution payloads
 *
 * @example
 * Array of block hashes: ...
 * Result: ...
 *
 * Implements the `engine_getPayloadBodiesByHashV1` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'engine_getPayloadBodiesByHashV1' as const

/**
 * Parameters for `engine_getPayloadBodiesByHashV1`
 */
export interface Params {
  array of block hashes: Quantity
}

/**
 * Result for `engine_getPayloadBodiesByHashV1`
 */
export type Result = Quantity
