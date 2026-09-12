import { describe, expect, it } from "vitest";
import { shouldPrefetchDirectoryMetadata } from "./metadataCache";

describe("directory metadata prefetch", () => {
  it("does not enqueue probes for a large video library", () => {
    const items = Array.from({ length: 1000 }, () => ({ type: "video/x-matroska" }));
    expect(shouldPrefetchDirectoryMetadata(items)).toBe(false);
  });
  it("does not enqueue video probes in mixed audio/video folders", () => {
    expect(shouldPrefetchDirectoryMetadata([
      { type: "audio/mpeg" }, { type: "video/mp4" },
    ])).toBe(false);
  });
  it("keeps album metadata prefetch for audio folders", () => {
    expect(shouldPrefetchDirectoryMetadata([
      { type: "audio/flac" }, { type: "image/jpeg" }, { type: "directory" },
    ])).toBe(true);
  });
  it("skips empty folders and entries without media types", () => {
    expect(shouldPrefetchDirectoryMetadata()).toBe(false);
    expect(shouldPrefetchDirectoryMetadata([{}, { type: "directory" }])).toBe(false);
  });
});
