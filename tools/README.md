# Code Generation Tools

This directory contains the Zig programs that generate type-safe Ethereum JSON-RPC method definitions from the official OpenRPC specification.

## Overview

The code generation process transforms the [Ethereum Execution API OpenRPC specification](../execution-apis/openrpc.json) into type-safe TypeScript interfaces and Zig structs. This ensures that all 65+ JSON-RPC methods have consistent, validated type definitions across both languages.

## Architecture

```
execution-apis/openrpc.json (15,598 lines)
            ↓
    tools/generate.zig (900+ lines)
            ↓
    src/ (146 generated files)
    ├── eth/      - 40 methods
    ├── debug/    - 5 methods
    └── engine/   - 20 methods
```

## Files

### `generate.zig`

The main code generator that:
1. Parses the OpenRPC specification (`execution-apis/openrpc.json`)
2. Groups methods by namespace (eth, debug, engine)
3. Generates three files per method:
   - `{method}.json` - Stripped OpenRPC definition
   - `{method}.zig` - Zig struct with Params/Result types
   - `{method}.ts` - TypeScript interface
4. Generates namespace aggregators (`methods.zig`, `methods.ts`)
5. Generates root combinators (`JsonRpc.zig`, `JsonRpc.ts`)

**Key Features:**
- Pattern-based type inference (recognizes Address, Hash, Quantity by regex)
- Enum detection for BlockTag
- Union type generation for BlockSpec (anyOf schemas)
- Inline schema expansion (no $refs)
- Cross-language JSON serialization consistency

### `clean.zig`

Removes all generated code while preserving hand-written types:
- Deletes: `src/eth/`, `src/debug/`, `src/engine/`, `src/JsonRpc.*`
- Preserves: `src/types/` (hand-written core types)

## Usage

```bash
# Clean generated code
zig build clean

# Generate all method files
zig build generate

# Both commands (full regeneration)
zig build clean && zig build generate
```

## Generation Process

### 1. Parse OpenRPC Specification

```zig
const spec_file = try std.fs.cwd().openFile("execution-apis/openrpc.json", .{});
const spec_content = try spec_file.readToEndAlloc(allocator, 100 * 1024 * 1024);
const parsed = try std.json.parseFromSlice(std.json.Value, allocator, spec_content, .{});
const methods = parsed.value.object.get("methods").?.array;
```

### 2. Group by Namespace

Methods are organized by their prefix:
- `eth_getBalance` → namespace: `eth`, method: `getBalance`
- `debug_getRawBlock` → namespace: `debug`, method: `getRawBlock`
- `engine_newPayloadV1` → namespace: `engine`, method: `newPayloadV1`

### 3. Infer Types from Schemas

The generator recognizes Ethereum types by their JSON Schema patterns:

```zig
// Pattern recognition
if (pattern) |p| {
    if (std.mem.eql(u8, p, "^0x[0-9a-fA-F]{40}$")) return "Address";
    if (std.mem.eql(u8, p, "^0x[0-9a-f]{64}$")) return "Hash";
    if (std.mem.eql(u8, p, "^0x(0|[1-9a-f][0-9a-f]*)$")) return "Quantity";
}

// Enum detection
if (schema.object.get("enum")) |_| return "BlockTag";

// Union types
if (schema.object.get("anyOf")) |_| return "BlockSpec";
```

### 4. Generate Type-Safe Code

#### Zig Output Example (`eth_getBalance.zig`):

```zig
pub const EthGetBalance = @This();

pub const method = "eth_getBalance";

pub const Params = struct {
    address: types.Address,
    block: types.BlockSpec,

    pub fn jsonStringify(self: Params, jws: *std.json.Stringify) !void {
        try jws.beginArray();
        try jws.write(self.address);
        try jws.write(self.block);
        try jws.endArray();
    }
};

pub const Result = struct {
    value: types.Quantity,

    pub fn jsonStringify(self: Result, jws: *std.json.Stringify) !void {
        try jws.write(self.value);
    }
};
```

#### TypeScript Output Example (`eth_getBalance.ts`):

```typescript
export const method = 'eth_getBalance' as const

export interface Params {
  address: Address
  block: BlockSpec
}

export type Result = Quantity
```

### 5. Generate Namespace Aggregators

Creates `methods.ts` and `methods.zig` for each namespace:

**TypeScript** (`eth/methods.ts`):
```typescript
// Tree-shakable imports
import * as eth_getBalance from './getBalance/eth_getBalance.js'
import * as eth_call from './call/eth_call.js'
// ... 38 more

export const EthMethod = {
  eth_getBalance: 'eth_getBalance',
  eth_call: 'eth_call',
  // ...
} as const

export type EthMethod = typeof EthMethod[keyof typeof EthMethod]

// Type helpers
export type EthParams<M extends EthMethod> = EthMethodMap[M]['Params']
export type EthResult<M extends EthMethod> = EthMethodMap[M]['Result']
```

**Zig** (`eth/methods.zig`):
```zig
pub const EthMethod = union(enum) {
    eth_getBalance: struct {
        params: eth_getBalance.Params,
        result: eth_getBalance.Result,
    },
    // ... 39 more

    pub fn methodName(self: EthMethod) []const u8 {
        return switch (self) {
            .eth_getBalance => eth_getBalance.method,
            // ...
        };
    }
};
```

## Type System

### Core Types (Hand-Written)

Located in `src/types/`, these are **never** auto-generated:

- **Address** (`Address.zig/ts`) - 20-byte Ethereum addresses
- **Hash** (`Hash.zig/ts`) - 32-byte hashes
- **Quantity** (`Quantity.zig/ts`) - u256 values with hex encoding
- **BlockTag** (`BlockTag.zig/ts`) - Block reference tags (earliest, finalized, safe, latest, pending)
- **BlockSpec** (`BlockSpec.zig/ts`) - Union of Quantity | BlockTag | Hash

### Type Inference Rules

1. **Pattern Matching**: Regex patterns in JSON Schema → Ethereum types
2. **Enum Detection**: Fixed enum values → BlockTag
3. **Union Types**: `anyOf` schemas → BlockSpec (discriminated union)
4. **Inline Expansion**: All schemas are expanded inline (no $refs)

### JSON Serialization

Both languages implement custom JSON serialization to match JSON-RPC 2.0 requirements:

**Zig:**
```zig
pub fn jsonStringify(self: Params, jws: *std.json.Stringify) !void {
    try jws.beginArray();  // JSON-RPC uses positional arrays
    try jws.write(self.address);
    try jws.write(self.block);
    try jws.endArray();
}
```

**TypeScript:**
```typescript
// Brand types for nominal typing
export type Address = Hex & { readonly __brand: 'Address' }
export type Quantity = Hex & { readonly __brand: 'Quantity' }
```

## Design Principles

### 1. Single Source of Truth

The OpenRPC specification is the sole source of truth. All code is generated from it, ensuring consistency.

### 2. Deterministic Generation

- Same spec always produces identical output
- No timestamps or randomness
- Reproducible builds across environments

### 3. Tree-Shakability (TypeScript)

Each method is a separate import path:
```typescript
// Import only what you need
import * as eth_getBalance from './eth/getBalance/eth_getBalance.js'
```

Bundlers can eliminate unused methods, reducing bundle size.

### 4. Type Safety

- **Zig**: Compile-time validation with `comptime` and type inference
- **TypeScript**: Brand types prevent mixing Address/Hash/Quantity
- **Cross-language**: Same validation rules applied in both

### 5. Zero Runtime Overhead

- **Zig**: All types resolve at compile time
- **TypeScript**: Brand types disappear after compilation (no runtime cost)

## Zig 0.15.2 Specifics

This project uses **Zig 0.15.2**, which has API differences from earlier versions:

### Key API Patterns

**JSON Parsing:**
```zig
const parsed = try std.json.parseFromSlice(std.json.Value, allocator, content, .{});
defer parsed.deinit();
const root = parsed.value;
```

**JSON Writing:**
```zig
const json_str = try std.json.Stringify.valueAlloc(allocator, value, .{});
defer allocator.free(json_str);
```

**File I/O:**
```zig
// In-memory output
var output: std.ArrayListUnmanaged(u8) = .{};
defer output.deinit(allocator);
const writer = output.writer(allocator);
try writer.writeAll("text");
```

**ArrayList Initialization:**
```zig
var list: std.ArrayList(T) = .empty;  // For hashmaps
defer list.deinit(allocator);
```

## Output Structure

```
src/
├── types/              # Hand-written (never generated)
│   ├── Address.zig/ts
│   ├── Hash.zig/ts
│   ├── Quantity.zig/ts
│   ├── BlockTag.zig/ts
│   └── BlockSpec.zig/ts
├── eth/                # Generated (40 methods)
│   ├── getBalance/
│   │   ├── eth_getBalance.json
│   │   ├── eth_getBalance.zig
│   │   └── eth_getBalance.ts
│   └── methods.zig/ts
├── debug/              # Generated (5 methods)
├── engine/             # Generated (20 methods)
├── JsonRpc.zig         # Root namespace combinator
└── JsonRpc.ts          # Root type helpers
```

## Memory Management

The generator uses Zig's `GeneralPurposeAllocator` for predictable behavior:

```zig
var gpa = std.heap.GeneralPurposeAllocator(.{}){};
defer _ = gpa.deinit();
const allocator = gpa.allocator();
```

All allocations are properly cleaned up with `defer`, ensuring no memory leaks even with 100MB+ input files.

## Error Handling

The generator validates:
- OpenRPC JSON structure
- Required schema fields
- Pattern syntax
- File system operations

All errors are propagated with Zig's `!` error union types, providing clear error messages.

## Extending the Generator

To add support for new types:

1. **Add pattern recognition** in `inferZigType()` and `inferTypeScriptType()`
2. **Create hand-written base type** in `src/types/`
3. **Update type exports** in `src/types.zig` and `src/types/index.ts`
4. **Regenerate**: `zig build clean && zig build generate`

## Testing

See `../src/root.zig` for comprehensive tests covering:
- Type serialization/deserialization
- Method parameter encoding
- JSON roundtrip validation
- Error handling

Run tests with:
```bash
zig build test
```

## References

- [Ethereum Execution API Specification](https://github.com/ethereum/execution-apis)
- [OpenRPC Specification](https://spec.open-rpc.org/)
- [Zig 0.15.2 Documentation](https://ziglang.org/documentation/0.15.2/)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
