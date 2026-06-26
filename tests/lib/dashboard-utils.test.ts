import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatRelativeTime, initialsFromName, sliderLabel } from "@/lib/dashboard-utils";

describe("initialsFromName", () => {
  it("returns the fallback for an empty string", () => {
    expect(initialsFromName("", "P1")).toBe("P1");
  });

  it("returns the fallback for whitespace-only input", () => {
    expect(initialsFromName("   ", "P1")).toBe("P1");
  });

  it("returns the first two chars for a single word", () => {
    expect(initialsFromName("Alice", "?")).toBe("AL");
  });

  it("returns first + second word initial for a two-word name", () => {
    expect(initialsFromName("Alice Bob", "?")).toBe("AB");
  });

  it("uppercases the result", () => {
    expect(initialsFromName("alice", "?")).toBe("AL");
  });
});

describe("sliderLabel", () => {
  const LABELS = ["Very low", "Low", "Medium", "High", "Very high"];

  it("returns the first label at 0", () => {
    expect(sliderLabel(0, LABELS)).toBe("Very low");
  });

  it("returns the correct bucket at 25", () => {
    expect(sliderLabel(25, LABELS)).toBe("Low");
  });

  it("returns the correct bucket at 50", () => {
    expect(sliderLabel(50, LABELS)).toBe("Medium");
  });

  it("returns the correct bucket at 75", () => {
    expect(sliderLabel(75, LABELS)).toBe("High");
  });

  it("clamps at the last label for value 100", () => {
    expect(sliderLabel(100, LABELS)).toBe("Very high");
  });
});

describe("formatRelativeTime", () => {
  const NOW = new Date("2026-06-26T12:00:00Z").getTime();

  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(NOW);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns "Just now" for timestamps less than 30 seconds ago', () => {
    expect(formatRelativeTime(new Date(NOW - 10_000).toISOString())).toBe("Just now");
  });

  it("returns minutes for recent timestamps (singular)", () => {
    expect(formatRelativeTime(new Date(NOW - 60_000).toISOString())).toBe("1 min ago");
  });

  it("returns minutes for recent timestamps (plural)", () => {
    expect(formatRelativeTime(new Date(NOW - 5 * 60_000).toISOString())).toBe("5 mins ago");
  });

  it("returns hours (singular)", () => {
    expect(formatRelativeTime(new Date(NOW - 3_600_000).toISOString())).toBe("1 hour ago");
  });

  it("returns hours (plural)", () => {
    expect(formatRelativeTime(new Date(NOW - 3 * 3_600_000).toISOString())).toBe("3 hours ago");
  });

  it("returns days (singular)", () => {
    expect(formatRelativeTime(new Date(NOW - 86_400_000).toISOString())).toBe("1 day ago");
  });

  it("returns days (plural)", () => {
    expect(formatRelativeTime(new Date(NOW - 3 * 86_400_000).toISOString())).toBe("3 days ago");
  });

  it("returns weeks for timestamps over a week old", () => {
    expect(formatRelativeTime(new Date(NOW - 14 * 86_400_000).toISOString())).toBe("2 weeks ago");
  });

  it("returns months for timestamps over a month old", () => {
    expect(formatRelativeTime(new Date(NOW - 60 * 86_400_000).toISOString())).toBe("2 months ago");
  });
});
