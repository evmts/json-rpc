const std = @import("std");

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

    // Process each method
    for (methods_array.items) |method| {
        const method_name = method.object.get("name").?.string;

        // Split method name by underscore to get namespace and method
        var parts = std.mem.splitScalar(u8, method_name, '_');
        const namespace = parts.next() orelse continue;
        const method_part = parts.rest();

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
        var out: std.io.Writer = .fixed(&out_buf);
        try std.json.Stringify.value(method, .{ .whitespace = .indent_2 }, &out);
        try json_file.writeAll(out.buffered());

        // Write Zig struct file (use snake_case for filename, PascalCase for struct name)
        const struct_name = try toPascalCase(allocator, method_name);
        defer allocator.free(struct_name);

        const zig_path = try std.fmt.allocPrint(allocator, "src/{s}/{s}/{s}.zig", .{ namespace, method_part, method_name });
        defer allocator.free(zig_path);

        const zig_file = try std.fs.cwd().createFile(zig_path, .{});
        defer zig_file.close();

        try generateZigStruct(allocator, method, struct_name, method_name, zig_file);

        // Write TypeScript file (in same directory as Zig file)
        const ts_path = try std.fmt.allocPrint(allocator, "src/{s}/{s}/{s}.ts", .{ namespace, method_part, method_name });
        defer allocator.free(ts_path);

        const ts_file = try std.fs.cwd().createFile(ts_path, .{});
        defer ts_file.close();

        try generateTypeScriptInterface(allocator, method, method_name, ts_file);

        std.debug.print("Created: {s}, {s}, and {s}\n", .{ json_path, zig_path, ts_path });
    }

    std.debug.print("\nDone! Processed {d} methods.\n", .{methods_array.items.len});
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
