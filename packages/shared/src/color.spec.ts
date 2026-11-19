import { describe, expect, it } from "vitest";

import { adjustLightness, oklchToHex, withAlpha } from "./color";

describe("adjustLightness", () => {
  it("returns the same color when nothing changes", () => {
    expect(adjustLightness("#f9f4ff", 0)).toBe("#f9f4ff");
    expect(adjustLightness("#2a1a3a", 0)).toBe("#2a1a3a");
  });

  it("darkens and lightens in the requested direction", () => {
    expect(adjustLightness("#808080", -0.1) < "#808080").toBe(true);
    expect(adjustLightness("#808080", 0.1) > "#808080").toBe(true);
  });

  it("keeps the hue of a very light color", () => {
    expect(adjustLightness("#f9f4ff", -0.164)).toBe("#c3bfc9");
  });

  it("keeps the alpha of a color and expands short hex", () => {
    expect(adjustLightness("#80808080", 0)).toBe("#80808080");
    expect(adjustLightness("#fff", 0)).toBe("#ffffff");
  });

  it("stops at black and white", () => {
    expect(adjustLightness("#000000", -0.5)).toBe("#000000");
    expect(adjustLightness("#ffffff", 0.5)).toBe("#ffffff");
  });
});

describe("oklchToHex", () => {
  it("converts Caido's token values to hex", () => {
    expect(oklchToHex("oklch(0.2732 0.0115 271)")).toBe("#25272d");
  });

  it("keeps the alpha of a translucent token", () => {
    expect(oklchToHex("oklch(0.7449 0.1231 74.5 / 0.16)")).toBe("#daa04a29");
  });

  it("returns nothing for a value that is not an oklch color", () => {
    expect(oklchToHex("calc(12 / 14 * 1rem)")).toBeUndefined();
  });
});

describe("withAlpha", () => {
  it("replaces the alpha of a color, expanding short hex", () => {
    expect(withAlpha("#daa04a29", 0.5)).toBe("#daa04a80");
    expect(withAlpha("#abc", 1)).toBe("#aabbccff");
  });
});
