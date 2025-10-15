# Ethereum JSON-RPC Specification

This repository contains the Ethereum JSON-RPC specification defined in OpenRPC format.

## Overview

The `execution-apis/openrpc.json` file (15,598 lines) is a comprehensive specification of the standard interface for Ethereum clients. It follows the [OpenRPC 1.2.4](https://spec.open-rpc.org/) specification format.

## File Structure

The openrpc.json file contains the following top-level structure:

```json
{
  "openrpc": "1.2.4",
  "info": { ... },
  "methods": [ ... ],
  "components": { ... }
}
```

### 1. Info Section

Contains metadata about the specification:

- **Title**: Ethereum JSON-RPC Specification
- **Description**: A specification of the standard interface for Ethereum clients
- **License**: CC0-1.0 (Public Domain)
- **Version**: 0.0.0

### 2. Methods Array

Contains **65 JSON-RPC methods** organized into 3 namespaces:

#### Debug Namespace (5 methods)
- `debug_getBadBlocks` - Returns bad blocks seen on the network
- `debug_getRawBlock` - Returns raw block data
- `debug_getRawHeader` - Returns raw block header
- `debug_getRawReceipts` - Returns raw transaction receipts
- `debug_getRawTransaction` - Returns raw transaction data

#### Engine Namespace (20 methods)
Engine API methods for consensus layer communication:
- `engine_exchangeCapabilities`
- `engine_exchangeTransitionConfigurationV1`
- `engine_forkchoiceUpdatedV1/V2/V3`
- `engine_getBlobsV1/V2`
- `engine_getPayloadBodiesByHashV1`
- `engine_getPayloadBodiesByRangeV1`
- `engine_getPayloadV1/V2/V3/V4/V5/V6`
- `engine_newPayloadV1/V2/V3/V4/V5`

#### Eth Namespace (40 methods)
Standard Ethereum JSON-RPC methods:
- **Account Operations**: `eth_accounts`, `eth_getBalance`, `eth_getCode`, `eth_getStorageAt`, `eth_getTransactionCount`
- **Block Operations**: `eth_blockNumber`, `eth_getBlockByHash`, `eth_getBlockByNumber`, `eth_getBlockReceipts`, `eth_getBlockTransactionCountByHash`, `eth_getBlockTransactionCountByNumber`, `eth_getUncleCountByBlockHash`, `eth_getUncleCountByBlockNumber`
- **Transaction Operations**: `eth_call`, `eth_createAccessList`, `eth_estimateGas`, `eth_sendRawTransaction`, `eth_sendTransaction`, `eth_sign`, `eth_signTransaction`, `eth_getTransactionByHash`, `eth_getTransactionByBlockHashAndIndex`, `eth_getTransactionByBlockNumberAndIndex`, `eth_getTransactionReceipt`
- **Filter Operations**: `eth_newFilter`, `eth_newBlockFilter`, `eth_newPendingTransactionFilter`, `eth_getFilterChanges`, `eth_getFilterLogs`, `eth_getLogs`, `eth_uninstallFilter`
- **Fee Operations**: `eth_gasPrice`, `eth_maxPriorityFeePerGas`, `eth_blobBaseFee`, `eth_feeHistory`
- **Network Operations**: `eth_chainId`, `eth_coinbase`, `eth_syncing`
- **Utility Operations**: `eth_getProof`, `eth_simulateV1`

### 3. Method Structure

Each method in the array has the following structure:

```json
{
  "name": "method_name",
  "summary": "Brief description of what the method does",
  "params": [
    {
      "name": "Parameter name",
      "required": true/false,
      "schema": {
        "title": "Schema title",
        "type": "string|number|object|array",
        "pattern": "regex pattern for validation",
        "enum": ["possible", "values"],
        "anyOf": [/* multiple schema options */]
      }
    }
  ],
  "result": {
    "name": "Result name",
    "schema": {
      "title": "Result schema title",
      "type": "string|number|object|array",
      "properties": { /* object structure */ },
      "items": { /* array item structure */ }
    }
  },
  "examples": [
    {
      "name": "Example name",
      "params": [/* example parameter values */],
      "result": {
        "name": "Result name",
        "value": "example result value"
      }
    }
  ]
}
```

### 4. Common Data Types

The specification defines strict data types with regex patterns:

- **Address**: `^0x[0-9a-fA-F]{40}$` - 20-byte hex string
- **Hash**: `^0x[0-9a-f]{64}$` - 32-byte hex string
- **Hex Integer**: `^0x(0|[1-9a-f][0-9a-f]*)$` - Hex-encoded integer
- **Logs Bloom**: `^0x[0-9a-f]{512}$` - 256-byte bloom filter
- **Block Tags**: `earliest`, `finalized`, `safe`, `latest`, `pending`

### 5. Block Parameters

Many methods accept flexible block specifications:

- **Block Number**: Hex-encoded block number
- **Block Tag**: Named tags (earliest, finalized, safe, latest, pending)
- **Block Hash**: 32-byte block hash

## Components Section

The `components` section is currently empty (`[]`), indicating all schemas are defined inline within the method definitions.

## Usage

This OpenRPC specification can be used to:

1. Generate client libraries for multiple programming languages
2. Generate interactive API documentation
3. Validate JSON-RPC requests and responses
4. Generate mock servers for testing
5. Create type definitions for type-safe development

## Example Method: eth_getBalance

```json
{
  "name": "eth_getBalance",
  "summary": "Returns the balance of the account of given address.",
  "params": [
    {
      "name": "Address",
      "required": true,
      "schema": {
        "type": "string",
        "pattern": "^0x[0-9a-fA-F]{40}$"
      }
    },
    {
      "name": "Block",
      "required": true,
      "schema": {
        "anyOf": [
          {"type": "string", "pattern": "^0x(0|[1-9a-f][0-9a-f]*)$"},
          {"type": "string", "enum": ["earliest", "finalized", "safe", "latest", "pending"]},
          {"type": "string", "pattern": "^0x[0-9a-f]{64}$"}
        ]
      }
    }
  ],
  "result": {
    "schema": {
      "type": "string",
      "pattern": "^0x(0|[1-9a-f][0-9a-f]*)$"
    }
  }
}
```

## Statistics

- **Total Lines**: 15,598
- **OpenRPC Version**: 1.2.4
- **Total Methods**: 65
  - Debug: 5 methods
  - Engine: 20 methods
  - Eth: 40 methods

## License

This specification is licensed under CC0-1.0 (Public Domain).

## Source

The specification is maintained as a git submodule in the `execution-apis` directory.
