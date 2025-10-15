const std = @import("std");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const src_dir = try std.fs.cwd().openDir("src", .{ .iterate = true });
    var iter = src_dir.iterate();

    var dirs_to_remove: std.ArrayListUnmanaged([]const u8) = .{};
    defer {
        for (dirs_to_remove.items) |dir| {
            allocator.free(dir);
        }
        dirs_to_remove.deinit(allocator);
    }

    // Collect directories to remove (everything except types/)
    while (try iter.next()) |entry| {
        if (entry.kind == .directory) {
            if (!std.mem.eql(u8, entry.name, "types")) {
                const name = try allocator.dupe(u8, entry.name);
                try dirs_to_remove.append(allocator, name);
            }
        }
    }

    // Remove collected directories
    for (dirs_to_remove.items) |dir_name| {
        const dir_path = try std.fmt.allocPrint(allocator, "src/{s}", .{dir_name});
        defer allocator.free(dir_path);

        std.fs.cwd().deleteTree(dir_path) catch |err| {
            std.debug.print("Warning: Could not remove {s}: {}\n", .{ dir_path, err });
        };
        std.debug.print("Removed: {s}/\n", .{dir_path});
    }

    std.debug.print("\nClean complete. Preserved src/types/\n", .{});
}
