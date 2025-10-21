// Package types provides core Ethereum JSON-RPC primitive types.
//
// This package contains hand-written type definitions that form the foundation
// of the generated JSON-RPC method types. All types implement proper JSON
// marshaling/unmarshaling and validation according to the Ethereum execution API specification.
//
// Core Types:
//   - Address: 20-byte Ethereum addresses (^0x[0-9a-fA-F]{40}$)
//   - Hash: 32-byte hashes (^0x[0-9a-f]{64}$)
//   - Quantity: Hex-encoded unsigned integers with no leading zeros (^0x(0|[1-9a-f][0-9a-f]*)$)
//   - BlockTag: Block reference tags (earliest, finalized, safe, latest, pending)
//   - BlockSpec: Union type for block identifiers (number, tag, or hash)
//
// These types are never auto-generated and provide the foundation for all
// generated method-specific types.
package types
