import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns an array of recent bad blocks that the client has seen on the network.
 *
 * @example
 * Result: ...
 *
 * Implements the `debug_getBadBlocks` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'debug_getBadBlocks' as const

/**
 * Parameters for `debug_getBadBlocks`
 */
export interface Params {
}

/**
 * Result for `debug_getBadBlocks`
 *
 * Bad block array
 */
export type Result = Quantity
