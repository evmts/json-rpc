# Ethereum JSON-RPC Type Generator

Type-safe TypeScript and Zig code generated from the [official Ethereum JSON-RPC specification](https://github.com/ethereum/execution-apis).

## What This Is

A code generator that transforms the OpenRPC specification (`execution-apis/openrpc.json`) into:

- **TypeScript**: Type-safe interfaces with brand types and tree-shakable exports
- **Zig**: Strongly-typed structs with JSON serialization
- **Coverage**: All 65 methods across `eth`, `debug`, and `engine` namespaces

**Key principle**: The OpenRPC spec is the single source of truth. All code in `src/` is generated and never committed.

## Installation

```bash
npm install @tevm/json-rpc
# or
bun add @tevm/json-rpc
```

## Build from Source

```bash
# Install dependencies
bun install

# Generate types from OpenRPC spec and build everything
zig build generate && zig build

# Or step by step:
zig build generate    # Generate type definitions
zig build build-ts    # Build TypeScript only
zig build test        # Run all tests (Zig + TypeScript)
zig build clean       # Clean generated code (preserves src/types/)
```

## Generated Structure

```
src/
├── types/              # Hand-written core types (Address, Hash, Quantity, BlockTag, BlockSpec)
├── eth/                # 40 methods: getBalance, call, sendTransaction, etc.
├── debug/              # 5 methods: getBadBlocks, getRawBlock, etc.
├── engine/             # 20 methods: newPayload, forkchoiceUpdated, etc.
└── JsonRpc.{zig,ts}    # Root namespace combinators
```

Each method generates:
- `method_name.json` - Stripped OpenRPC spec
- `method_name.zig` - Zig Params/Result structs
- `method_name.ts` - TypeScript interfaces

## Type System

All Ethereum types use strict validation patterns:

- **Address**: `^0x[0-9a-fA-F]{40}$` (20 bytes)
- **Hash**: `^0x[0-9a-f]{64}$` (32 bytes)
- **Quantity**: `^0x(0|[1-9a-f][0-9a-f]*)$` (u256, no leading zeros)
- **BlockTag**: `earliest` | `finalized` | `safe` | `latest` | `pending`
- **BlockSpec**: Union of Quantity | BlockTag | Hash

## Usage

### TypeScript

```typescript
// Import specific method types
import { eth_getBalance, EthMethod } from '@tevm/json-rpc'
import type { Address, Quantity } from '@tevm/json-rpc'

// Type-safe parameters and results
type Params = typeof eth_getBalance.Params
type Result = typeof eth_getBalance.Result

// Use brand types for compile-time safety
const address: Address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' as Address
const balance: Quantity = '0x1a' as Quantity

// Method enums (tree-shakable)
console.log(EthMethod.eth_getBalance) // 'eth_getBalance'
```

### Zig

```zig
const specs = @import("specs");
const eth = specs.eth;

// Type-safe structs
const params = eth.getBalance.Params{
    .address = .{ .bytes = address_bytes },
    .block = .{ .tag = .latest },
};
```

## Source

- **Spec**: Git submodule at `execution-apis/` (OpenRPC 1.2.4)
- **Generator**: `tools/generate.zig` (900+ lines)
- **License**: CC0-1.0 (Public Domain)
