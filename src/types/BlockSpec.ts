import type { Quantity } from './Quantity.js'
import type { BlockTag } from './BlockTag.js'
import type { Hash } from './Hash.js'

/**
 * Block specification - can be a block number, tag, or hash.
 *
 * - Block number: A hex-encoded unsigned integer (Quantity)
 * - Block tag: One of "earliest", "finalized", "safe", "latest", or "pending"
 * - Block hash: A 32-byte hex-encoded hash
 *
 * @see https://github.com/ethereum/execution-apis
 */
export type BlockSpec = Quantity | BlockTag | Hash
