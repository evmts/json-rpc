# Claude/Agent Instructions

## Project Overview

This is an **Ethereum JSON-RPC Specification Generator** that transforms the official OpenRPC specification into type-safe TypeScript interfaces and Zig structs. The project generates comprehensive type definitions for all Ethereum JSON-RPC methods across multiple namespaces (eth, debug, engine).

**Key Principle**: The OpenRPC specification (`execution-apis/openrpc.json`) is the single source of truth. All code in `src/` is generated and never committed to git.

## Architecture Overview

### Code Generation Workflow

1. **Source**: `execution-apis/openrpc.json` (15,598 lines, git submodule)
2. **Generator**: `tools/generate.zig` (900+ lines Zig program)
3. **Output**: `src/` directory (146 generated files: JSON specs + TypeScript + Zig)
4. **Organization**: Methods grouped by namespace with comprehensive type mappings

### File Structure

```
src/
├── types/                    # Hand-written core types (NEVER auto-generated)
│   ├── Address.zig/ts       # 20-byte addresses with brand typing
│   ├── Hash.zig/ts          # 32-byte hashes
│   ├── Quantity.zig/ts      # u256 values with hex encoding
│   ├── BlockTag.zig/ts      # earliest|finalized|safe|latest|pending
│   └── BlockSpec.zig/ts     # Union: Quantity | BlockTag | Hash
├── eth/                     # Ethereum namespace methods
│   ├── getBalance/
│   │   ├── eth_getBalance.json    # Stripped OpenRPC spec
│   │   ├── eth_getBalance.zig     # Zig struct (Params/Result)
│   │   └── eth_getBalance.ts      # TypeScript interface
│   └── methods.zig/ts       # Namespace aggregator with type mappings
├── debug/                   # Debug namespace methods
├── engine/                  # Engine namespace methods
├── JsonRpc.zig              # Root union combining all namespaces
└── JsonRpc.ts               # Generic JSON-RPC 2.0 helpers
```

**Critical**: Only files in `src/types/` are hand-written. Everything else is generated.

## Zig 0.15.2 API Reference

**IMPORTANT**: This project uses Zig 0.15.2. Claude's training data is based on Zig 0.14, which has significant API differences.

### Critical API Differences in 0.15.2

#### 1. JSON API

**Parsing JSON**:
```zig
// Parse JSON from string/bytes
const parsed = try std.json.parseFromSlice(std.json.Value, allocator, content, .{});
defer parsed.deinit();
const root = parsed.value;  // Access the parsed value

// Access JSON values
const methods = root.object.get("methods").?.array;
const name_str = obj.object.get("name").?.string;
```

**Writing JSON**:
```zig
// NEW in 0.15.2: Use Stringify.valueAlloc or write stream
const json_str = try std.json.Stringify.valueAlloc(allocator, value, .{});
defer allocator.free(json_str);

// Or use a streaming writer (more efficient for large output):
var output: std.ArrayListUnmanaged(u8) = .{};
defer output.deinit(allocator);
const writer = output.writer(allocator);

try writer.writeAll("const std = @import(\"std\");\n");
try writer.print("pub const {s} = @This();\n", .{name});
```

**Custom Type Serialization** (required for JSON-RPC types):
```zig
pub fn jsonStringify(self: Address, jws: anytype) !void {
    try jws.beginArray();
    try jws.write(self.field);
    try jws.endArray();
}

pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !Address {
    if (source != .array) return error.UnexpectedToken;
    return Address{ .field = try std.json.innerParseFromValue(T, allocator, source.array.items[0], options) };
}
```

#### 2. ArrayList / ArrayListUnmanaged

**Initialization** (common mistake area):
```zig
// Managed ArrayList (auto-cleanup)
var list = std.ArrayList(T).init(allocator);
defer list.deinit();
try list.append(item);

// Unmanaged ArrayList (manual memory management - preferred for output buffers)
var output: std.ArrayListUnmanaged(u8) = .{};
defer output.deinit(allocator);
const writer = output.writer(allocator);  // Get a writer

// Initialize to empty in hashmap
const gop = try map.getOrPut(key);
if (!gop.found_existing) {
    gop.value_ptr.* = .empty;  // Initialize ArrayList.Managed as empty
}
try gop.value_ptr.append(allocator, item);
```

**Common Operations**:
```zig
try list.append(allocator, item);
const slice = try list.toOwnedSlice(allocator);  // Caller owns memory
const items = list.items;  // Borrow current items
```

#### 3. File I/O

**Reading Files**:
```zig
// Open and read file
const file = try std.fs.cwd().openFile(path, .{});
defer file.close();

// Read entire file into memory (allocates)
const content = try file.readToEndAlloc(allocator, max_size);
defer allocator.free(content);

// Use writeAll to write to file
try file.writeAll(content);
```

**File Writers** (requires buffer in 0.15.2):
```zig
// WRONG (0.14 style):
// const writer = file.writer();

// CORRECT (0.15.2 requires buffer):
var buffer: [4096]u8 = undefined;
const writer = file.writer(&buffer);

// For in-memory output, use ArrayListUnmanaged:
var output: std.ArrayListUnmanaged(u8) = .{};
defer output.deinit(allocator);
const writer = output.writer(allocator);
try writer.writeAll("text");
try writer.print("format: {}", .{value});
// Then write to file:
try file.writeAll(output.items);
```

**Creating Files/Directories**:
```zig
// Create directory recursively
try std.fs.cwd().makePath(dir_path);

// Create file (overwrites if exists)
const file = try std.fs.cwd().createFile(path, .{});
defer file.close();
```

### When Working with Zig Code

If you encounter compilation errors:

1. **Check the submodule first**: `context/zig` contains Zig 0.15.2 source code
2. **Read the actual API**: `context/zig/lib/std/{module}.zig`
3. **Match patterns from existing code**: `tools/generate.zig` contains working examples
4. **Common error patterns**:
   - "no member named 'writer'" on File → Use `file.writer(&buffer)` not `file.writer()`
   - ArrayList init issues → Use `.empty` for managed lists in hashmaps
   - JSON stringify errors → Use `std.json.Stringify.valueAlloc()` not old API

### Key Module Locations

- **Standard Library**: `context/zig/lib/std/`
- **JSON**: `context/zig/lib/std/json.zig` + `context/zig/lib/std/json/Stringify.zig`
- **ArrayList**: `context/zig/lib/std/array_list.zig`
- **File System**: `context/zig/lib/std/fs.zig` + `context/zig/lib/std/fs/File.zig`
- **Build System**: `context/zig/lib/std/Build.zig`

## Build System

### Commands

- `zig build clean` - Remove all generated code in `src/` (preserves `src/types/`)
- `zig build generate` - Generate all method files from OpenRPC spec
- `zig build test` - Run tests defined in `src/root.zig`

### Build Configuration

The `build.zig` defines a "specs" module that external projects can import:

```zig
const mod = b.addModule("specs", .{
    .root_source_file = b.path("src/root.zig"),
    .target = target,
});
```

## Coding Standards & Best Practices

### TypeScript Patterns

**1. Object-as-const Pattern (NOT TypeScript enums)**:

```typescript
// ✅ CORRECT: Use object-as-const
export const BlockTag = {
  earliest: 'earliest',
  finalized: 'finalized',
  safe: 'safe',
  latest: 'latest',
  pending: 'pending',
} as const

export type BlockTag = (typeof BlockTag)[keyof typeof BlockTag]

// ❌ NEVER: Don't use TypeScript enums
enum BlockTag { earliest = 'earliest' }  // DON'T DO THIS
```

**Why object-as-const?**
- **Tree-shakability**: Only used values are bundled
- **Type safety**: No value duplications
- **Flexibility**: Can add helper functions easily
- **Import simplicity**: Better module compatibility

**2. Brand Types for Nominal Typing**:

```typescript
export type Address = Hex & { readonly __brand: 'Address' }
export type Hash = Hex & { readonly __brand: 'Hash' }
export type Quantity = Hex & { readonly __brand: 'Quantity' }
```

This creates compile-time type distinction without runtime overhead.

**3. Union Type Helpers**:

```typescript
export type JsonRpcParams<M extends JsonRpcMethod> =
  M extends EthMethod ? EthParams<M> :
  M extends DebugMethod ? DebugParams<M> :
  never
```

Enables method-specific type extraction with IDE autocomplete.

### Zig Patterns

**1. Struct Definition Pattern**:

```zig
pub const Address = @This();  // Name the struct type

/// Raw 20-byte address
bytes: [20]u8,

/// JSON serialization (required by std.json)
pub fn jsonStringify(self: Address, jws: anytype) !void { ... }
pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !Address { ... }
```

**2. Union Types for Schema Polymorphism**:

```zig
pub const BlockSpec = union(enum) {
    number: Quantity,
    tag: BlockTag,
    hash: Hash,

    pub fn jsonStringify(self: BlockSpec, jws: anytype) !void {
        switch (self) {
            .number => |qty| try qty.jsonStringify(jws),
            .tag => |t| try t.jsonStringify(jws),
            .hash => |h| try h.jsonStringify(jws),
        }
    }
};
```

**3. JSON-RPC Parameter Serialization**:

```zig
pub const Params = struct {
    address: types.Address,
    block: types.BlockSpec,

    // JSON-RPC uses positional arrays
    pub fn jsonStringify(self: Params, jws: anytype) !void {
        try jws.beginArray();
        try jws.write(self.address);
        try jws.write(self.block);
        try jws.endArray();
    }
};
```

### Core Type System

All Ethereum types build on three primitives:

- **Address**: 20 bytes, `^0x[0-9a-fA-F]{40}$`
- **Hash**: 32 bytes, `^0x[0-9a-f]{64}$`
- **Quantity**: u256, `^0x(0|[1-9a-f][0-9a-f]*)$` (no leading zeros)

**Hex Normalization Rules**:
- Always lowercase: `0x1a` not `0x1A`
- No leading zeros: `0x0` not `0x00` (except zero itself)
- Strict pattern validation in both languages

### Error Handling

- **Zig**: Use `!` return types, propagate with `try`
- **TypeScript**: Runtime validation with throw on invalid input
- **Validation**: Both languages validate against same regex patterns

### Module Organization

**For Tree-Shakability**:
- Each method is separate import path
- Namespace aggregators re-export methods
- Import only what you use: `import * as eth_getBalance from '...'`
- Root modules don't import implementation details

## Development Workflow

### Adding New Methods

1. Update `execution-apis` submodule (or modify `openrpc.json`)
2. Run `zig build clean`
3. Run `zig build generate`
4. New method files appear automatically in `src/{namespace}/{method}/`

### Modifying Core Types

1. Edit files in `src/types/` (hand-written, never auto-generated)
2. Run `zig build generate` to regenerate methods using updated types
3. All method files automatically use updated type definitions

### Integration

- **Zig projects**: Add dependency via `build.zig.zon`, import "specs" module
- **TypeScript projects**: Import generated modules, use type-only imports where possible
- **Never commit**: Generated files should not be committed to version control

## Type Generation Logic

The generator uses pattern matching on OpenRPC schemas:

```zig
// Pattern recognition in tools/generate.zig
if (pattern) |p| {
    if (std.mem.eql(u8, p, "^0x[0-9a-fA-F]{40}$")) return "Address";
    if (std.mem.eql(u8, p, "^0x[0-9a-f]{64}$")) return "Hash";
    if (std.mem.eql(u8, p, "^0x(0|[1-9a-f][0-9a-f]*)$")) return "Quantity";
}
```

**Schema Mapping**:
- Pattern-based: Regex patterns → specific types
- Enum-based: Fixed values → BlockTag
- Union-based: "anyOf" schemas → BlockSpec (discriminated union)
- Inline schemas: Everything expanded inline (no $refs)

## Quality Assurance

### Deterministic Generation
- Same spec always produces identical output
- No timestamps or randomness in generated code
- Reproducible builds across environments

### Cross-Language Consistency
- Method names identical: `eth_getBalance` in both Zig and TypeScript
- Parameter order matches: Array positions correspond between languages
- Type validation uses same regex patterns
- Error messages consistent between implementations

### Memory Safety (Zig)
- `GeneralPurposeAllocator` for predictable behavior
- Proper `defer` cleanup of all allocations
- No memory leaks even with 100MB+ JSON files

**REMEMBER**: This codebase prioritizes type safety, cross-language consistency, and deterministic generation from a single source of truth.
