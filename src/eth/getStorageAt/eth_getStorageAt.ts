import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the value from a storage position at a given address.
 *
 * @example
 * Address: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
 * Storage slot: "0x0"
 * Block: "latest"
 * Result: "0x0000000000000000000000000000000000000000000000000000000000000000"
 *
 * Implements the `eth_getStorageAt` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getStorageAt' as const

/**
 * Parameters for `eth_getStorageAt`
 */
export interface Params {
  /** hex encoded address */
  address: Address

  /** 32 hex encoded bytes */
  storage slot: Quantity

  /** Block number, tag, or block hash */
  block: BlockSpec
}

/**
 * Result for `eth_getStorageAt`
 *
 * hex encoded bytes
 */
export type Result = Quantity
