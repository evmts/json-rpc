/**
 * @fileoverview Block tag enum for referencing specific blocks
 *
 * Uses @tevm/primitives for type compatibility across the ecosystem.
 */

/**
 * Block tags for referencing specific blocks.
 *
 * - `earliest`: The lowest numbered block the client has available
 * - `finalized`: The most recent crypto-economically secure block, cannot be re-orged outside of manual intervention driven by community coordination
 * - `safe`: The most recent block that is safe from re-orgs under honest majority and certain synchronicity assumptions
 * - `latest`: The most recent block in the canonical chain observed by the client, this block may be re-orged out of the canonical chain even under healthy/normal conditions
 * - `pending`: A sample next block built by the client on top of `latest` and containing the set of transactions usually taken from local mempool
 *
 * **Note**: Compatible with `@tevm/primitives/ethereum-types` BlockTag type.
 *
 * @see https://github.com/ethereum/execution-apis
 */
export const BlockTag = {
  earliest: 'earliest',
  finalized: 'finalized',
  safe: 'safe',
  latest: 'latest',
  pending: 'pending',
}

/**
 * Type representing a block tag value.
 *
 * @typedef {(typeof BlockTag)[keyof typeof BlockTag]} BlockTag
 */
