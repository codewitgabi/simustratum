import { describe, expect, it } from "vitest";
import { getInitials } from "@/lib/auth";

describe("getInitials", () => {
  it("returns first two chars for a single word", () => {
    expect(getInitials("Gabriel")).toBe("GA");
  });

  it("returns first + last initial for two words", () => {
    expect(getInitials("Gabriel Michael")).toBe("GM");
  });

  it("uses first + last word when more than two words are given", () => {
    expect(getInitials("Gabriel Michael Ojomakpene")).toBe("GO");
  });

  it("trims surrounding whitespace before splitting", () => {
    expect(getInitials("  Alice  Bob  ")).toBe("AB");
  });

  it("uppercases the result", () => {
    expect(getInitials("alice bob")).toBe("AB");
  });

  it("handles a single-character name", () => {
    expect(getInitials("A")).toBe("A");
  });
});
