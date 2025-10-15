# Generated Source Code

This directory contains **auto-generated** type definitions for all Ethereum JSON-RPC methods. The code is generated from the OpenRPC specification at `execution-apis/openrpc.json` by the `tools/generate.zig` program.

**⚠️ WARNING**: All files in this directory (except `types/`) are auto-generated and should **never be committed to git**. They are rebuilt on demand via `zig build generate`.

## Folder Structure

```
src/
├── types/                     # Hand-written core types (NEVER auto-generated)
│   ├── Address.{zig,ts}      # 20-byte addresses (^0x[0-9a-fA-F]{40}$)
│   ├── Hash.{zig,ts}         # 32-byte hashes (^0x[0-9a-f]{64}$)
│   ├── Quantity.{zig,ts}     # u256 values (^0x(0|[1-9a-f][0-9a-f]*)$)
│   ├── BlockTag.{zig,ts}     # earliest|finalized|safe|latest|pending
│   ├── BlockSpec.{zig,ts}    # Union: Quantity | BlockTag | Hash
│   └── Hex.ts                # Base hex string type (TypeScript only)
│
├── eth/                       # Ethereum namespace (40 methods) [GENERATED]
│   ├── getBalance/
│   │   ├── eth_getBalance.json    # Stripped OpenRPC spec for this method
│   │   ├── eth_getBalance.zig     # Zig Params/Result structs
│   │   └── eth_getBalance.ts      # TypeScript interfaces
│   ├── call/
│   ├── sendTransaction/
│   ├── ... (37 more methods)
│   ├── methods.zig           # Zig namespace aggregator
│   └── methods.ts            # TypeScript namespace aggregator
│
├── debug/                     # Debug namespace (5 methods) [GENERATED]
│   ├── getBadBlocks/
│   ├── getRawBlock/
│   ├── ... (3 more methods)
│   ├── methods.zig
│   └── methods.ts
│
├── engine/                    # Engine API namespace (20 methods) [GENERATED]
│   ├── newPayloadV1/
│   ├── forkchoiceUpdatedV1/
│   ├── ... (18 more methods)
│   ├── methods.zig
│   └── methods.ts
│
├── types.zig                  # Re-exports all core types (Zig)
├── index.ts                   # Re-exports all types (TypeScript)
├── JsonRpc.zig                # Root union type combining all namespaces
└── JsonRpc.ts                 # Generic JSON-RPC 2.0 helpers
```

## What Gets Generated

### Per-Method Files (3 files per method)

Each JSON-RPC method (e.g., `eth_getBalance`) generates:

1. **`{method}.json`** - Stripped-down OpenRPC spec for that method only
   - Contains method name, description, params schema, result schema
   - Used for reference and testing

2. **`{method}.zig`** - Zig type definitions
   - `Params` struct with positional JSON-RPC parameter serialization
   - `Result` struct for the method's return type
   - Both implement `jsonStringify` and `jsonParseFromValue` for Zig 0.15.2

3. **`{method}.ts`** - TypeScript type definitions
   - `Params` interface with named parameters
   - `Result` type alias
   - Uses brand types from `src/types/` for compile-time safety

### Namespace Aggregators

Each namespace directory contains aggregator files:

- **`methods.zig`** - Re-exports all methods as a Zig namespace
- **`methods.ts`** - Re-exports all methods + enum of method names

### Root Files

- **`JsonRpc.zig`** - Zig union type that can represent any method call
- **`JsonRpc.ts`** - Generic JSON-RPC 2.0 request/response/error types
- **`types.zig`** - Zig module that re-exports all core types
- **`index.ts`** - TypeScript entrypoint that re-exports everything

## Hand-Written vs Generated

### Hand-Written (Never Modified by Generator)

Only the `types/` directory contains hand-written code:

- `Address.zig` / `Address.ts`
- `Hash.zig` / `Hash.ts`
- `Quantity.zig` / `Quantity.ts`
- `BlockTag.zig` / `BlockTag.ts`
- `BlockSpec.zig` / `BlockSpec.ts`
- `Hex.ts` (TypeScript-only base type)
- `index.ts` (TypeScript exports)

These files are committed to git and must be maintained manually.

### Generated (Never Commit to Git)

Everything else is generated:

- All namespace directories (`eth/`, `debug/`, `engine/`)
- All method-specific files (`*/*.json`, `*/*.zig`, `*/*.ts`)
- All namespace aggregators (`*/methods.{zig,ts}`)
- Root combinators (`JsonRpc.{zig,ts}`, `types.zig`, `index.ts`)

## Type Generation Logic

The generator (`tools/generate.zig`) uses pattern matching on OpenRPC schemas:

### Pattern Recognition

```zig
// Recognizes specific hex patterns and maps to core types
if (pattern == "^0x[0-9a-fA-F]{40}$") return "Address";
if (pattern == "^0x[0-9a-f]{64}$") return "Hash";
if (pattern == "^0x(0|[1-9a-f][0-9a-f]*)$") return "Quantity";
```

### Schema Types

- **Pattern-based**: Regex patterns → `Address`, `Hash`, `Quantity`
- **Enum-based**: Fixed string values → `BlockTag`
- **Union-based**: `anyOf` schemas → `BlockSpec` (discriminated union)
- **Inline schemas**: Complex objects expanded inline (no `$ref` resolution)

### Cross-Language Consistency

Both Zig and TypeScript implementations:
- Use identical method names (`eth_getBalance`)
- Maintain same parameter order
- Validate with identical regex patterns
- Generate deterministic output (same spec = same code every time)

## Regenerating Code

To regenerate all source files:

```bash
# Clean all generated files (preserves src/types/)
zig build clean

# Regenerate from OpenRPC spec
zig build generate
```

The generator is idempotent: running it multiple times produces identical output.

## Usage Examples

### TypeScript

```typescript
// Import specific method types (tree-shakable)
import { eth_getBalance } from '@tevm/apis/eth/getBalance'
import type { Address, BlockTag } from '@tevm/apis'

// Type-safe parameters
const params: typeof eth_getBalance.Params = {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' as Address,
  block: 'latest' as BlockTag,
}

// Type-safe result
const result: typeof eth_getBalance.Result = '0x1a' as Quantity
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

// Serialize to JSON-RPC format
const json = try std.json.Stringify.valueAlloc(allocator, params, .{});
// => ["0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0", "latest"]
```

## Git Ignore

The `.gitignore` must exclude all generated files:

```gitignore
# Generated source code (except types/)
src/**/*.zig
src/**/*.ts
src/**/*.json
!src/types/
!src/types/**
```

This ensures only the hand-written core types and the generator itself are version controlled.

## Why This Approach?

1. **Single source of truth**: The OpenRPC spec is authoritative
2. **Type safety**: Compile-time guarantees in both languages
3. **Consistency**: Impossible for Zig and TypeScript to drift apart
4. **Maintainability**: Adding a new method requires zero manual code changes
5. **Tree-shakability**: Each method is a separate import path
6. **No commits**: Reduces git noise and merge conflicts
