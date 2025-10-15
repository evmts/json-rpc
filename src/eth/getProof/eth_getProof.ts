import type {
  Address,
  Hash,
  Quantity,
  BlockTag,
  BlockSpec,
} from '../../types/index.js'

/**
 * Returns the merkle proof for a given account and optionally some storage keys.
 *
 * @example
 * Address: "0xe5cB067E90D5Cd1F8052B83562Ae670bA4A211a8"
 * StorageKeys: ...
 * Block: "latest"
 * Result: ...
 *
 * Implements the `eth_getProof` JSON-RPC method.
 */

/** The JSON-RPC method name */
export const method = 'eth_getProof' as const

/**
 * Parameters for `eth_getProof`
 */
export interface Params {
  /** hex encoded address */
  address: Address

  /** Storage keys */
  storagekeys: Quantity

  /** Block number, tag, or block hash */
  block: BlockSpec
}

/**
 * Result for `eth_getProof`
 *
 * Account proof
 */
export type Result = Quantity
