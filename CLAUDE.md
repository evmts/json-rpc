# Claude/Agent Instructions

## Zig 0.15.2 API Reference

**IMPORTANT**: This project uses Zig 0.15.2. Claude's training data is based on Zig 0.14, which has significant API differences.

### When Working with Zig Code

If you encounter compilation errors or API issues when writing Zig code:

1. **Check the submodule first**: `context/zig` contains the Zig 0.15.2 source code
2. **Read the relevant standard library files** to understand the correct API
3. Common areas where APIs have changed:
   - `std.json` - JSON parsing and stringification
   - `std.Build` - Build system APIs
   - `std.ArrayList` - Now uses different initialization patterns
   - File I/O - `File.writer()` now requires a buffer parameter

### Example Workflow

When you need to use a Zig standard library API:

```
1. Attempt to write code based on your knowledge
2. If compilation fails with "no member named X" or similar:
   - Read context/zig/lib/zig/std/{module}.zig
   - Find the correct function signatures and usage patterns
   - Update your code to match the 0.15.2 API
```

### Key Locations

- **Standard Library**: `context/zig/lib/zig/std/`
- **JSON API**: `context/zig/lib/zig/std/json.zig`
- **Build API**: `context/zig/lib/zig/std/Build.zig`
- **ArrayList**: `context/zig/lib/zig/std/array_list.zig`

## Project Structure

- `execution-apis/` - Ethereum JSON-RPC specification (git submodule)
- `context/zig/` - Zig 0.15.2 source code (git submodule, for API reference)
- `src/` - Generated method specifications (auto-generated, not committed)
- `tools/` - Build and generation tools
- `build.zig` - Zig build configuration

## Build Commands

- `zig build clean` - Remove all generated code in src/
- `zig build generate` - Generate method JSON files from OpenRPC spec
