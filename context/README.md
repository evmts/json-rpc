# Zig Standard Library Context

This directory contains the **Zig 0.15.2 standard library source code** as a git submodule to help AI assistants work effectively with this project.

## Why This Exists

AI models like Claude were primarily trained on **Zig 0.14**, which has significant API differences from Zig 0.15.2. Without access to the current standard library, AI assistants may suggest outdated patterns that don't compile.

By providing the actual Zig 0.15.2 source code as context, AI can:

1. **Look up correct APIs** when uncertain about syntax
2. **Understand breaking changes** between versions
3. **Reference actual implementations** instead of relying on potentially outdated training data

## Critical Modules

When working on Zig code in this project, AI should reference:

- **`lib/std/json.zig`** - JSON parsing/serialization (major API changes in 0.15.2)
- **`lib/std/json/Stringify.zig`** - New JSON stringification API
- **`lib/std/array_list.zig`** - ArrayList and ArrayListUnmanaged
- **`lib/std/fs.zig`** - File system operations
- **`lib/std/fs/File.zig`** - File I/O (writer API changed)
- **`lib/std/Build.zig`** - Build system and build steps

## Common Issues from Outdated Knowledge

### 1. JSON API (Changed in 0.15.2)

**Old (0.14)**:
```zig
const json_str = try std.json.stringify(value, .{}, allocator, writer);
```

**New (0.15.2)**:
```zig
const json_str = try std.json.Stringify.valueAlloc(allocator, value, .{});
```

### 2. File Writer Pattern (Changed in 0.15.2)

**Old (0.14)**:
```zig
const writer = file.writer();
```

**New (0.15.2)**:
```zig
var buffer: [4096]u8 = undefined;
const writer = file.writer(&buffer);

// Or use ArrayListUnmanaged for in-memory:
var output: std.ArrayListUnmanaged(u8) = .{};
defer output.deinit(allocator);
const writer = output.writer(allocator);
```

### 3. ArrayList Initialization in Hashmaps

**Old (0.14)**:
```zig
gop.value_ptr.* = .{};
```

**New (0.15.2)**:
```zig
gop.value_ptr.* = .empty;  // For managed ArrayLists
```

## How to Use This Context

When encountering compilation errors or API uncertainties:

1. **Check the actual source** in `context/zig/lib/std/{module}.zig`
2. **Look for similar patterns** in `tools/generate.zig` (working examples)
3. **Match the exact API signatures** from the source files

See `../CLAUDE.md` for detailed migration patterns and Zig coding guidelines.

## Maintenance

This submodule should track the same Zig version used by the project. When upgrading Zig:

```bash
cd context/zig
git fetch --tags
git checkout <new-version-tag>
cd ../..
git add context/zig
git commit -m "chore: Update Zig stdlib context to <version>"
```

Current version: **Zig 0.15.2**
