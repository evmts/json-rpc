const std = @import("std");

const MethodInfo = struct {
    name: []const u8,
    namespace: []const u8,
    method_part: []const u8,
    json_value: std.json.Value,
};

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Read the OpenRPC specification
    const spec_path = "execution-apis/openrpc.json";
    const spec_file = try std.fs.cwd().openFile(spec_path, .{});
    defer spec_file.close();

    const spec_content = try spec_file.readToEndAlloc(allocator, 100 * 1024 * 1024);
    defer allocator.free(spec_content);

    // Parse JSON
    const parsed = try std.json.parseFromSlice(std.json.Value, allocator, spec_content, .{});
    defer parsed.deinit();

    const root = parsed.value;
    const methods = root.object.get("methods") orelse return error.NoMethodsFound;
    const methods_array = methods.array;

    std.debug.print("Processing {d} methods...\n", .{methods_array.items.len});

    // Collect methods by namespace
    var namespaces = std.StringHashMap(std.ArrayList(MethodInfo)).init(allocator);
    defer {
        var it = namespaces.valueIterator();
        while (it.next()) |list| {
            list.deinit(allocator);
        }
        namespaces.deinit();
    }

    // First pass: collect methods by namespace
    for (methods_array.items) |method| {
        const method_name = method.object.get("name").?.string;

        // Split method name by underscore to get namespace and method
        var parts = std.mem.splitScalar(u8, method_name, '_');
        const namespace = parts.next() orelse continue;
        const method_part = parts.rest();

        const gop = try namespaces.getOrPut(namespace);
        if (!gop.found_existing) {
            gop.value_ptr.* = .empty;
        }

        try gop.value_ptr.append(allocator, .{
            .name = method_name,
            .namespace = namespace,
            .method_part = method_part,
            .json_value = method,
        });
    }

    // Second pass: generate files for each method
    var ns_it = namespaces.iterator();
    while (ns_it.next()) |entry| {
        const namespace = entry.key_ptr.*;
        const method_list = entry.value_ptr.*;

        for (method_list.items) |method_info| {
            const method = method_info.json_value;
            const method_name = method_info.name;
            const method_part = method_info.method_part;

            // Create method directory inside namespace (recursive)
            const method_dir_path = try std.fmt.allocPrint(allocator, "src/{s}/{s}", .{ namespace, method_part });
            defer allocator.free(method_dir_path);

            try std.fs.cwd().makePath(method_dir_path);

            // Write JSON spec file
            const json_path = try std.fmt.allocPrint(allocator, "src/{s}/{s}/{s}.json", .{ namespace, method_part, method_name });
            defer allocator.free(json_path);

            const json_file = try std.fs.cwd().createFile(json_path, .{});
            defer json_file.close();

            var out_buf: [1024 * 1024]u8 = undefined;
            var fbs = std.io.fixedBufferStream(&out_buf);
            try std.json.stringify(method, .{ .whitespace = .minified }, fbs.writer());
            try json_file.writeAll(fbs.getWritten());

            // Write Zig struct file
            const struct_name = try toPascalCase(allocator, method_name);
            defer allocator.free(struct_name);

            const zig_path = try std.fmt.allocPrint(allocator, "src/{s}/{s}/{s}.zig", .{ namespace, method_part, method_name });
            defer allocator.free(zig_path);

            const zig_file = try std.fs.cwd().createFile(zig_path, .{});
            defer zig_file.close();

            try generateZigStruct(allocator, method, struct_name, method_name, zig_file);

            // Write TypeScript file
            const ts_path = try std.fmt.allocPrint(allocator, "src/{s}/{s}/{s}.ts", .{ namespace, method_part, method_name });
            defer allocator.free(ts_path);

            const ts_file = try std.fs.cwd().createFile(ts_path, .{});
            defer ts_file.close();

            try generateTypeScriptInterface(allocator, method, method_name, ts_file);

            std.debug.print("Created: {s}, {s}, and {s}\n", .{ json_path, zig_path, ts_path });
        }

        // Generate methods.ts and methods.zig for this namespace
        try generateNamespaceMethodsTS(allocator, namespace, method_list.items);
        try generateNamespaceMethodsZig(allocator, namespace, method_list.items);
    }

    // Generate root JsonRpc.ts and JsonRpc.zig
    var namespace_list: std.ArrayList([]const u8) = .empty;
    defer namespace_list.deinit(allocator);

    var ns_keys = namespaces.keyIterator();
    while (ns_keys.next()) |ns| {
        try namespace_list.append(allocator, ns.*);
    }

    try generateRootJsonRpcTS(allocator, namespace_list.items);
    try generateRootJsonRpcZig(allocator, namespace_list.items);

    std.debug.print("\nDone! Processed {d} methods across {d} namespaces.\n", .{ methods_array.items.len, namespaces.count() });
}

fn toPascalCase(allocator: std.mem.Allocator, snake_case: []const u8) ![]u8 {
    var result: std.ArrayListUnmanaged(u8) = .{};
    defer result.deinit(allocator);

    var capitalize_next = true;
    for (snake_case) |c| {
        if (c == '_') {
            capitalize_next = true;
        } else if (capitalize_next) {
            try result.append(allocator, std.ascii.toUpper(c));
            capitalize_next = false;
        } else {
            try result.append(allocator, c);
        }
    }

    return result.toOwnedSlice(allocator);
}

fn generateZigStruct(allocator: std.mem.Allocator, method: std.json.Value, struct_name: []const u8, method_name: []const u8, file: std.fs.File) !void {
    var output: std.ArrayListUnmanaged(u8) = .{};
    defer output.deinit(allocator);
    const writer = output.writer(allocator);

    // Write imports
    try writer.writeAll("const std = @import(\"std\");\n");
    try writer.writeAll("const types = @import(\"../../types.zig\");\n\n");

    // Write summary as doc comment
    if (method.object.get("summary")) |summary| {
        if (summary == .string) {
            try writer.writeAll("/// ");
            try writer.writeAll(summary.string);
            try writer.writeAll("\n");
        }
    }

    // Write examples as doc comments
    if (method.object.get("examples")) |examples| {
        if (examples == .array and examples.array.items.len > 0) {
            try writer.writeAll("///\n/// Example:\n");
            const first_example = examples.array.items[0];
            if (first_example.object.get("params")) |params| {
                if (params == .array) {
                    for (params.array.items) |param| {
                        if (param.object.get("name")) |name| {
                            if (param.object.get("value")) |value| {
                                try writer.writeAll("/// ");
                                try writer.writeAll(name.string);
                                try writer.writeAll(": ");
                                try writeJsonValue(value, writer.any());
                                try writer.writeAll("\n");
                            }
                        }
                    }
                }
            }
            if (first_example.object.get("result")) |result| {
                if (result.object.get("value")) |value| {
                    try writer.writeAll("/// Result: ");
                    try writeJsonValue(value, writer.any());
                    try writer.writeAll("\n");
                }
            }
        }
    }

    try writer.writeAll("///\n/// Implements the `");
    try writer.writeAll(method_name);
    try writer.writeAll("` JSON-RPC method.\n");
    try writer.print("pub const {s} = @This();\n\n", .{struct_name});

    // Export method name
    try writer.writeAll("/// The JSON-RPC method name\n");
    try writer.writeAll("pub const method = \"");
    try writer.writeAll(method_name);
    try writer.writeAll("\";\n\n");

    // Generate Params struct
    if (method.object.get("params")) |params| {
        if (params == .array) {
            try generateParamsStruct(allocator, params.array, method_name, writer.any());
        }
    }

    // Generate Result struct
    if (method.object.get("result")) |result| {
        try generateResultStruct(allocator, result, method_name, writer.any());
    }

    // Write accumulated output to file
    try file.writeAll(output.items);
}

fn generateParamsStruct(allocator: std.mem.Allocator, params: std.json.Array, method_name: []const u8, writer: anytype) !void {
    try writer.writeAll("/// Parameters for `");
    try writer.writeAll(method_name);
    try writer.writeAll("`\n");
    try writer.writeAll("pub const Params = struct {\n");

    for (params.items) |param| {
        const param_name = param.object.get("name").?.string;
        const schema = param.object.get("schema").?;

        // Write doc comment for field
        if (schema.object.get("title")) |title| {
            try writer.writeAll("    /// ");
            try writer.writeAll(title.string);
            try writer.writeAll("\n");
        }

        // Determine field type
        const field_name = try toSnakeCase(allocator, param_name);
        defer allocator.free(field_name);

        const field_type = try inferZigType(schema);
        try writer.writeAll("    ");
        try writer.writeAll(field_name);
        try writer.writeAll(": ");
        try writer.writeAll(field_type);
        try writer.writeAll(",\n");
    }

    // If params is empty, handle unused parameter warnings
    if (params.items.len == 0) {
        try writer.writeAll("\n    pub fn jsonStringify(self: Params, jws: anytype) !void {\n");
        try writer.writeAll("        _ = self;\n");
        try writer.writeAll("        try jws.write(.{});\n");
        try writer.writeAll("    }\n\n");
        try writer.writeAll("    pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !Params {\n");
        try writer.writeAll("        _ = allocator;\n");
        try writer.writeAll("        _ = source;\n");
        try writer.writeAll("        _ = options;\n");
        try writer.writeAll("        return Params{};\n");
        try writer.writeAll("    }\n");
    } else {
        try writer.writeAll("\n    pub fn jsonStringify(self: Params, jws: anytype) !void {\n");
        try writer.writeAll("        try jws.beginArray();\n");

        for (params.items, 0..) |_, i| {
            const param = params.items[i];
            const param_name = param.object.get("name").?.string;
            const field_name = try toSnakeCase(allocator, param_name);
            defer allocator.free(field_name);

            try writer.writeAll("        try jws.write(self.");
            try writer.writeAll(field_name);
            try writer.writeAll(");\n");
        }

        try writer.writeAll("        try jws.endArray();\n");
        try writer.writeAll("    }\n\n");

        try writer.writeAll("    pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !Params {\n");
        try writer.writeAll("        if (source != .array) return error.UnexpectedToken;\n");
        try writer.print("        if (source.array.items.len != {d}) return error.InvalidParamCount;\n\n", .{params.items.len});
        try writer.writeAll("        return Params{\n");

        for (params.items, 0..) |_, i| {
            const param = params.items[i];
            const param_name = param.object.get("name").?.string;
            const field_name = try toSnakeCase(allocator, param_name);
            defer allocator.free(field_name);

            const schema = param.object.get("schema").?;
            const field_type = try inferZigType(schema);

            try writer.writeAll("            .");
            try writer.writeAll(field_name);
            try writer.writeAll(" = try std.json.innerParseFromValue(");
            try writer.writeAll(field_type);
            try writer.print(", allocator, source.array.items[{d}], options),\n", .{i});
        }

        try writer.writeAll("        };\n");
        try writer.writeAll("    }\n");
    }
    try writer.writeAll("};\n\n");
}

fn generateResultStruct(allocator: std.mem.Allocator, result: std.json.Value, method_name: []const u8, writer: anytype) !void {
    _ = allocator;

    try writer.writeAll("/// Result for `");
    try writer.writeAll(method_name);
    try writer.writeAll("`\n");
    try writer.writeAll("pub const Result = struct {\n");

    const schema = result.object.get("schema").?;

    if (schema.object.get("title")) |title| {
        try writer.writeAll("    /// ");
        try writer.writeAll(title.string);
        try writer.writeAll("\n");
    }

    const result_type = try inferZigType(schema);
    try writer.writeAll("    value: ");
    try writer.writeAll(result_type);
    try writer.writeAll(",\n\n");

    try writer.writeAll("    pub fn jsonStringify(self: Result, jws: anytype) !void {\n");
    try writer.writeAll("        try jws.write(self.value);\n");
    try writer.writeAll("    }\n\n");

    try writer.writeAll("    pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !Result {\n");
    try writer.writeAll("        return Result{\n");
    try writer.writeAll("            .value = try std.json.innerParseFromValue(");
    try writer.writeAll(result_type);
    try writer.writeAll(", allocator, source, options),\n");
    try writer.writeAll("        };\n");
    try writer.writeAll("    }\n");
    try writer.writeAll("};\n");
}

fn inferZigType(schema: std.json.Value) ![]const u8 {
    // Check for anyOf (union types like BlockSpec)
    if (schema.object.get("anyOf")) |_| {
        // Check if this looks like a BlockSpec
        if (schema.object.get("title")) |title| {
            const title_str = title.string;
            if (std.mem.indexOf(u8, title_str, "Block") != null) {
                return "types.BlockSpec";
            }
        }
        return "types.BlockSpec"; // Default for anyOf
    }

    // Check pattern to determine type
    if (schema.object.get("pattern")) |pattern| {
        const pattern_str = pattern.string;

        // Address pattern: ^0x[0-9a-fA-F]{40}$
        if (std.mem.indexOf(u8, pattern_str, "{40}") != null) {
            return "types.Address";
        }

        // Hash pattern: ^0x[0-9a-f]{64}$
        if (std.mem.indexOf(u8, pattern_str, "{64}") != null) {
            return "types.Hash";
        }

        // Quantity pattern: ^0x(0|[1-9a-f][0-9a-f]*)$
        if (std.mem.indexOf(u8, pattern_str, "[1-9a-f]") != null) {
            return "types.Quantity";
        }
    }

    // Check for enum (likely BlockTag)
    if (schema.object.get("enum")) |_| {
        return "types.BlockTag";
    }

    // Default to Quantity for unrecognized patterns
    return "types.Quantity";
}

fn toSnakeCase(allocator: std.mem.Allocator, str: []const u8) ![]u8 {
    var result: std.ArrayListUnmanaged(u8) = .{};
    defer result.deinit(allocator);

    for (str) |c| {
        try result.append(allocator, std.ascii.toLower(c));
    }

    return result.toOwnedSlice(allocator);
}

fn writeJsonValue(value: std.json.Value, writer: anytype) !void {
    switch (value) {
        .string => |s| {
            try writer.writeAll("\"");
            try writer.writeAll(s);
            try writer.writeAll("\"");
        },
        .number_string => |s| try writer.writeAll(s),
        .float => |f| try writer.print("{d}", .{f}),
        .integer => |i| try writer.print("{d}", .{i}),
        .bool => |b| try writer.writeAll(if (b) "true" else "false"),
        .null => try writer.writeAll("null"),
        else => try writer.writeAll("..."),
    }
}

fn generateTypeScriptInterface(allocator: std.mem.Allocator, method: std.json.Value, method_name: []const u8, file: std.fs.File) !void {
    var output: std.ArrayListUnmanaged(u8) = .{};
    defer output.deinit(allocator);
    const writer = output.writer(allocator);

    // Write imports
    try writer.writeAll("import type {\n");
    try writer.writeAll("  Address,\n");
    try writer.writeAll("  Hash,\n");
    try writer.writeAll("  Quantity,\n");
    try writer.writeAll("  BlockTag,\n");
    try writer.writeAll("  BlockSpec,\n");
    try writer.writeAll("} from '../../types/index.js'\n\n");

    // Write summary as JSDoc comment
    if (method.object.get("summary")) |summary| {
        if (summary == .string) {
            try writer.writeAll("/**\n");
            try writer.writeAll(" * ");
            try writer.writeAll(summary.string);
            try writer.writeAll("\n");
        }
    }

    // Write examples
    if (method.object.get("examples")) |examples| {
        if (examples == .array and examples.array.items.len > 0) {
            try writer.writeAll(" *\n * @example\n");
            const first_example = examples.array.items[0];
            if (first_example.object.get("params")) |params| {
                if (params == .array) {
                    for (params.array.items) |param| {
                        if (param.object.get("name")) |name| {
                            if (param.object.get("value")) |value| {
                                try writer.writeAll(" * ");
                                try writer.writeAll(name.string);
                                try writer.writeAll(": ");
                                try writeJsonValue(value, writer.any());
                                try writer.writeAll("\n");
                            }
                        }
                    }
                }
            }
            if (first_example.object.get("result")) |result| {
                if (result.object.get("value")) |value| {
                    try writer.writeAll(" * Result: ");
                    try writeJsonValue(value, writer.any());
                    try writer.writeAll("\n");
                }
            }
        }
    }

    try writer.writeAll(" *\n");
    try writer.writeAll(" * Implements the `");
    try writer.writeAll(method_name);
    try writer.writeAll("` JSON-RPC method.\n");
    try writer.writeAll(" */\n\n");

    // Export method name
    try writer.writeAll("/** The JSON-RPC method name */\n");
    try writer.writeAll("export const method = '");
    try writer.writeAll(method_name);
    try writer.writeAll("' as const\n\n");

    // Generate Params interface
    if (method.object.get("params")) |params| {
        if (params == .array) {
            try generateTypeScriptParams(allocator, params.array, method_name, writer.any());
        }
    }

    // Generate Result interface
    if (method.object.get("result")) |result| {
        try generateTypeScriptResult(allocator, result, method_name, writer.any());
    }

    // Write accumulated output to file
    try file.writeAll(output.items);
}

fn generateTypeScriptParams(allocator: std.mem.Allocator, params: std.json.Array, method_name: []const u8, writer: anytype) !void {
    try writer.writeAll("/**\n");
    try writer.writeAll(" * Parameters for `");
    try writer.writeAll(method_name);
    try writer.writeAll("`\n");
    try writer.writeAll(" */\n");
    try writer.writeAll("export interface Params {\n");

    for (params.items, 0..) |param, i| {
        const param_name = param.object.get("name").?.string;
        const schema = param.object.get("schema").?;

        // Write JSDoc for field
        if (schema.object.get("title")) |title| {
            try writer.writeAll("  /** ");
            try writer.writeAll(title.string);
            try writer.writeAll(" */\n");
        }

        const field_name = try toSnakeCase(allocator, param_name);
        defer allocator.free(field_name);

        const field_type = try inferTypeScriptType(schema);
        try writer.writeAll("  ");
        try writer.writeAll(field_name);
        try writer.writeAll(": ");
        try writer.writeAll(field_type);
        try writer.writeAll("\n");

        if (i < params.items.len - 1) {
            try writer.writeAll("\n");
        }
    }

    try writer.writeAll("}\n\n");
}

fn generateTypeScriptResult(allocator: std.mem.Allocator, result: std.json.Value, method_name: []const u8, writer: anytype) !void {
    _ = allocator;

    const schema = result.object.get("schema").?;
    const result_type = try inferTypeScriptType(schema);

    try writer.writeAll("/**\n");
    try writer.writeAll(" * Result for `");
    try writer.writeAll(method_name);
    try writer.writeAll("`\n");

    if (schema.object.get("title")) |title| {
        try writer.writeAll(" *\n");
        try writer.writeAll(" * ");
        try writer.writeAll(title.string);
        try writer.writeAll("\n");
    }

    try writer.writeAll(" */\n");
    try writer.writeAll("export type Result = ");
    try writer.writeAll(result_type);
    try writer.writeAll("\n");
}

fn inferTypeScriptType(schema: std.json.Value) ![]const u8 {
    // Check for anyOf (union types like BlockSpec)
    if (schema.object.get("anyOf")) |_| {
        if (schema.object.get("title")) |title| {
            const title_str = title.string;
            if (std.mem.indexOf(u8, title_str, "Block") != null) {
                return "BlockSpec";
            }
        }
        return "BlockSpec";
    }

    // Check pattern to determine type
    if (schema.object.get("pattern")) |pattern| {
        const pattern_str = pattern.string;

        // Address pattern: ^0x[0-9a-fA-F]{40}$
        if (std.mem.indexOf(u8, pattern_str, "{40}") != null) {
            return "Address";
        }

        // Hash pattern: ^0x[0-9a-f]{64}$
        if (std.mem.indexOf(u8, pattern_str, "{64}") != null) {
            return "Hash";
        }

        // Quantity pattern: ^0x(0|[1-9a-f][0-9a-f]*)$
        if (std.mem.indexOf(u8, pattern_str, "[1-9a-f]") != null) {
            return "Quantity";
        }
    }

    // Check for enum (likely BlockTag)
    if (schema.object.get("enum")) |_| {
        return "BlockTag";
    }

    // Default to Quantity
    return "Quantity";
}

fn generateNamespaceMethodsTS(allocator: std.mem.Allocator, namespace: []const u8, methods: []const MethodInfo) !void {
    const path = try std.fmt.allocPrint(allocator, "src/{s}/methods.ts", .{namespace});
    defer allocator.free(path);

    const file = try std.fs.cwd().createFile(path, .{});
    defer file.close();

    var output: std.ArrayListUnmanaged(u8) = .{};
    defer output.deinit(allocator);
    const writer = output.writer(allocator);

    // Write header
    const ns_pascal = try toPascalCase(allocator, namespace);
    defer allocator.free(ns_pascal);

    try writer.print(
        \\/**
        \\ * {s} JSON-RPC Methods
        \\ *
        \\ * This module provides a type-safe mapping of {s} namespace methods to their types.
        \\ * All imports are kept separate to maintain tree-shakability.
        \\ */
        \\
        \\
    , .{ ns_pascal, namespace });

    // Generate imports
    try writer.writeAll("// Method imports - each import is separate for tree-shaking\n");
    for (methods) |m| {
        try writer.print("import * as {s} from './{s}/{s}.js'\n", .{ m.name, m.method_part, m.name });
    }
    try writer.writeAll("\n");

    // Generate enum
    try writer.print(
        \\/**
        \\ * Method name enum - provides string literals for each method
        \\ */
        \\export const {s}Method = {{
        \\
    , .{ns_pascal});

    for (methods) |m| {
        try writer.print("  {s}: '{s}',\n", .{ m.name, m.name });
    }

    try writer.print(
        \\}} as const
        \\
        \\/**
        \\ * Type-safe method name union
        \\ */
        \\export type {s}Method = typeof {s}Method[keyof typeof {s}Method]
        \\
        \\/**
        \\ * Type mapping from method name to method module
        \\ */
        \\export interface {s}MethodMap {{
        \\
    , .{ ns_pascal, ns_pascal, ns_pascal, ns_pascal });

    for (methods) |m| {
        try writer.print("  '{s}': typeof {s}\n", .{ m.name, m.name });
    }

    try writer.print(
        \\}}
        \\
        \\/**
        \\ * Helper type to extract Params type from method name
        \\ */
        \\export type {s}Params<M extends {s}Method> = {s}MethodMap[M]['Params']
        \\
        \\/**
        \\ * Helper type to extract Result type from method name
        \\ */
        \\export type {s}Result<M extends {s}Method> = {s}MethodMap[M]['Result']
        \\
        \\// Re-export individual method modules for direct access (tree-shakable)
        \\export {{
        \\
    , .{ ns_pascal, ns_pascal, ns_pascal, ns_pascal, ns_pascal, ns_pascal });

    for (methods, 0..) |m, i| {
        try writer.print("  {s}", .{m.name});
        if (i < methods.len - 1) try writer.writeAll(",\n") else try writer.writeAll(",\n");
    }

    try writer.writeAll("}\n");

    try file.writeAll(output.items);
    std.debug.print("Generated {s}\n", .{path});
}

fn generateNamespaceMethodsZig(allocator: std.mem.Allocator, namespace: []const u8, methods: []const MethodInfo) !void {
    const path = try std.fmt.allocPrint(allocator, "src/{s}/methods.zig", .{namespace});
    defer allocator.free(path);

    const file = try std.fs.cwd().createFile(path, .{});
    defer file.close();

    var output: std.ArrayListUnmanaged(u8) = .{};
    defer output.deinit(allocator);
    const writer = output.writer(allocator);

    const ns_pascal = try toPascalCase(allocator, namespace);
    defer allocator.free(ns_pascal);

    try writer.writeAll("const std = @import(\"std\");\n\n");

    // Generate imports
    try writer.print("// Import all {s} method modules\n", .{namespace});
    for (methods) |m| {
        try writer.print("const {s} = @import(\"{s}/{s}.zig\");\n", .{ m.name, m.method_part, m.name });
    }
    try writer.writeAll("\n");

    // Generate tagged union
    try writer.print(
        \\/// Tagged union of all {s} namespace methods
        \\/// Maps method names to their corresponding parameter and result types
        \\pub const {s}Method = union(enum) {{
        \\
    , .{ namespace, ns_pascal });

    for (methods) |m| {
        try writer.print(
            \\    {s}: struct {{
            \\        params: {s}.Params,
            \\        result: {s}.Result,
            \\    }},
            \\
        , .{ m.name, m.name, m.name });
    }

    try writer.print(
        \\
        \\    /// Get the method name string from the union tag
        \\    pub fn methodName(self: {s}Method) []const u8 {{
        \\        return switch (self) {{
        \\
    , .{ns_pascal});

    for (methods) |m| {
        try writer.print("            .{s} => {s}.method,\n", .{ m.name, m.name });
    }

    try writer.print(
        \\        }};
        \\    }}
        \\
        \\    /// Parse method name string to enum tag
        \\    pub fn fromMethodName(method_name: []const u8) !std.meta.Tag({s}Method) {{
        \\        const map = std.StaticStringMap(std.meta.Tag({s}Method)).initComptime(.{{
        \\
    , .{ ns_pascal, ns_pascal });

    for (methods) |m| {
        try writer.print("            .{{ \"{s}\", .{s} }},\n", .{ m.name, m.name });
    }

    try writer.writeAll(
        \\        });
        \\
        \\        return map.get(method_name) orelse error.UnknownMethod;
        \\    }
        \\};
        \\
    );

    try file.writeAll(output.items);
    std.debug.print("Generated {s}\n", .{path});
}

fn generateRootJsonRpcTS(allocator: std.mem.Allocator, namespaces: []const []const u8) !void {
    const path = "src/JsonRpc.ts";
    const file = try std.fs.cwd().createFile(path, .{});
    defer file.close();

    var output: std.ArrayListUnmanaged(u8) = .{};
    defer output.deinit(allocator);
    const writer = output.writer(allocator);

    try writer.writeAll(
        \\/**
        \\ * Ethereum JSON-RPC Type System
        \\ *
        \\ * This module provides the root JSON-RPC namespace that combines all method namespaces.
        \\ * Imports are kept tree-shakable - only import what you use.
        \\ */
        \\
        \\
    );

    // Import namespace methods
    for (namespaces) |ns| {
        const ns_pascal = try toPascalCase(allocator, ns);
        defer allocator.free(ns_pascal);
        try writer.print("import type {{ {s}Method, {s}Params, {s}Result, {s}MethodMap }} from './{s}/methods.js'\n", .{ ns_pascal, ns_pascal, ns_pascal, ns_pascal, ns });
        try writer.print("export * from './{s}/methods.js'\n", .{ns});
    }

    try writer.writeAll("\n// Export primitive types separately\nexport * as types from './types/index.js'\n\n");

    // Generate union type for all methods
    try writer.writeAll("/**\n * Union of all JSON-RPC method names\n */\nexport type JsonRpcMethod = ");
    for (namespaces, 0..) |ns, i| {
        const ns_pascal = try toPascalCase(allocator, ns);
        defer allocator.free(ns_pascal);
        try writer.print("{s}Method", .{ns_pascal});
        if (i < namespaces.len - 1) try writer.writeAll(" | ") else try writer.writeAll("\n\n");
    }

    // Generate param/result helper types
    try writer.writeAll(
        \\/**
        \\ * Extract parameters type for any JSON-RPC method
        \\ */
        \\export type JsonRpcParams<M extends JsonRpcMethod> =
        \\
    );

    for (namespaces, 0..) |ns, i| {
        const ns_pascal = try toPascalCase(allocator, ns);
        defer allocator.free(ns_pascal);
        try writer.print("  M extends {s}Method ? {s}Params<M> :", .{ ns_pascal, ns_pascal });
        if (i < namespaces.len - 1) try writer.writeAll("\n") else try writer.writeAll("\n  never\n\n");
    }

    try writer.writeAll(
        \\/**
        \\ * Extract result type for any JSON-RPC method
        \\ */
        \\export type JsonRpcResult<M extends JsonRpcMethod> =
        \\
    );

    for (namespaces, 0..) |ns, i| {
        const ns_pascal = try toPascalCase(allocator, ns);
        defer allocator.free(ns_pascal);
        try writer.print("  M extends {s}Method ? {s}Result<M> :", .{ ns_pascal, ns_pascal });
        if (i < namespaces.len - 1) try writer.writeAll("\n") else try writer.writeAll("\n  never\n");
    }

    try file.writeAll(output.items);
    std.debug.print("Generated {s}\n", .{path});
}

fn generateRootJsonRpcZig(allocator: std.mem.Allocator, namespaces: []const []const u8) !void {
    const path = "src/JsonRpc.zig";
    const file = try std.fs.cwd().createFile(path, .{});
    defer file.close();

    var output: std.ArrayListUnmanaged(u8) = .{};
    defer output.deinit(allocator);
    const writer = output.writer(allocator);

    try writer.writeAll("const std = @import(\"std\");\n\n");

    // Import namespace methods
    for (namespaces) |ns| {
        const ns_pascal = try toPascalCase(allocator, ns);
        defer allocator.free(ns_pascal);
        try writer.print("const {s}Methods = @import(\"{s}/methods.zig\");\n", .{ ns, ns });
    }

    try writer.writeAll("\n// Export primitive types separately\npub const types = @import(\"types.zig\");\n\n");

    // Generate root tagged union
    try writer.writeAll(
        \\/// Root JSON-RPC method union combining all namespaces
        \\pub const JsonRpcMethod = union(enum) {
        \\
    );

    for (namespaces) |ns| {
        const ns_pascal = try toPascalCase(allocator, ns);
        defer allocator.free(ns_pascal);
        try writer.print("    {s}: {s}Methods.{s}Method,\n", .{ ns, ns, ns_pascal });
    }

    try writer.writeAll(
        \\
        \\    /// Get the full method name string
        \\    pub fn methodName(self: JsonRpcMethod) []const u8 {
        \\        return switch (self) {
        \\
    );

    for (namespaces) |ns| {
        try writer.print("            .{s} => |m| m.methodName(),\n", .{ns});
    }

    try writer.writeAll(
        \\        };
        \\    }
        \\};
        \\
    );

    try file.writeAll(output.items);
    std.debug.print("Generated {s}\n", .{path});
}
