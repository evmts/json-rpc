# Primitives Integration - Blocked Issue

## Summary

Integration with `@tevm/primitives` Zig package is blocked due to missing native library dependencies when using `zig fetch`.

## Error Encountered

```
error: /Users/williamcory/.cache/zig/p/guillotine_primitives-0.1.0-yOt5gSKBmwByR-nW_-VQGVIcTYVOOOlWnEAYkuo1n87R/target/release/libcrypto_wrappers.a: file not found
```

## Root Cause

Per the [README](https://github.com/evmts/primitives/blob/main/README.md#using-as-a-dependency), the correct usage requires:

```zig
// Link required C artifacts
exe.linkLibrary(primitives_dep.artifact("blst"));
exe.linkLibrary(primitives_dep.artifact("c_kzg"));

// Link optional Rust artifacts (not available in WASM builds)
if (primitives_dep.builder.lazyDependency("crypto_wrappers", .{})) |_| {
    if (primitives_dep.artifact("bn254")) |bn254| exe.linkLibrary(bn254);
    if (primitives_dep.artifact("keccak-asm")) |keccak| exe.linkLibrary(keccak);
}

exe.linkLibC();
```

However, when using `zig fetch` to install the dependency, the native libraries (C and Rust artifacts) are **not pre-built**. The README states:

> **Recommended:** Build from source
> ```bash
> git clone https://github.com/evmts/primitives.git
> cd primitives
> zig build
> ```
> **Note:** Requires [Cargo (Rust)](https://www.rust-lang.org/tools/install) to be installed.

## What We Tried

1. ✅ Installed via `zig fetch --save https://github.com/evmts/primitives/archive/main.tar.gz`
2. ✅ Installed via npm: `bun install github:evmts/primitives`
3. ✅ Added dependency to `build.zig.zon`
4. ❌ Attempted to link primitives module
5. ❌ Build failed - missing `libcrypto_wrappers.a`

## Issue Assessment

This appears to be a **documentation/packaging issue**, not a usage error:

### Questions:

1. **Should `zig fetch` work without building from source?**
   - The README recommends building from source
   - But `zig fetch` is listed as an "Alternative"
   - It's unclear if `zig fetch` should provide pre-built artifacts

2. **Are the Rust artifacts optional?**
   - README says they're "not available in WASM builds"
   - But the error suggests the build system expects them
   - The conditional `if (primitives_dep.artifact("bn254"))` suggests they should be optional

3. **Should the package include pre-built binaries?**
   - Could the package include pre-built artifacts for common platforms?
   - Or should users always build from source?

## Possible Solutions

### Option A: Build from Source (Requires Rust)
```bash
cd node_modules/@tevm/primitives
zig build
cd ../../..
# Then uncomment primitives imports in build.zig
```

### Option B: Package Pre-built Artifacts
- Include pre-built libraries for common platforms (x86_64-linux, x86_64-macos, aarch64-macos, etc.)
- Make Rust dependency truly optional

### Option C: Document Limitation
- Clearly state in README that `zig fetch` requires subsequent `zig build` in the fetched directory
- Explain that Rust toolchain is required

## GitHub Issue

**Issue opened**: https://github.com/evmts/primitives/issues/7

The issue requests clarification on:
- Whether `zig fetch` should work without building from source
- If not, whether documentation should be clearer
- Whether pre-built artifacts could be provided for common platforms

## Current Workaround

For now, we've:
1. Documented types as "compatible with @tevm/primitives"
2. Kept local implementations that follow primitives conventions
3. Commented out primitives imports in `build.zig`
4. TypeScript integration works perfectly (npm package includes all needed code)

The architecture is ready for full integration once the native dependency issue is resolved.
