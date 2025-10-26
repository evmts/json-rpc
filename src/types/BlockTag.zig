const std = @import("std");

/// Block tag for referencing specific blocks
///
/// Follows @tevm/primitives conventions for BlockTag type.
///
/// - `earliest`: The lowest numbered block the client has available
/// - `finalized`: The most recent crypto-economically secure block
/// - `safe`: The most recent block that is safe from re-orgs
/// - `latest`: The most recent block in the canonical chain
/// - `pending`: A sample next block built on top of `latest`
pub const BlockTag = enum {
    earliest,
    finalized,
    safe,
    latest,
    pending,

    pub fn toString(self: BlockTag) []const u8 {
        return switch (self) {
            .earliest => "earliest",
            .finalized => "finalized",
            .safe => "safe",
            .latest => "latest",
            .pending => "pending",
        };
    }

    pub fn fromString(str: []const u8) !BlockTag {
        if (std.mem.eql(u8, str, "earliest")) return .earliest;
        if (std.mem.eql(u8, str, "finalized")) return .finalized;
        if (std.mem.eql(u8, str, "safe")) return .safe;
        if (std.mem.eql(u8, str, "latest")) return .latest;
        if (std.mem.eql(u8, str, "pending")) return .pending;
        return error.InvalidBlockTag;
    }

    /// Serialize to JSON using Zig 0.15 API
    pub fn jsonStringify(self: BlockTag, jws: *std.json.Stringify) !void {
        try jws.write(self.toString());
    }

    /// Deserialize from JSON using Zig 0.15 API
    pub fn jsonParseFromValue(allocator: std.mem.Allocator, source: std.json.Value, options: std.json.ParseOptions) !BlockTag {
        _ = allocator;
        _ = options;
        if (source != .string) return error.UnexpectedToken;
        return try fromString(source.string);
    }
};
