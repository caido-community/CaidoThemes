import { describe, expect, it } from "vitest";

import { buildThemeCss } from "./css";
import { isSameTheme, setTokenColor, usedColors } from "./edit";
import type { ThemeContent } from "./schemas";

const theme: ThemeContent = {
  version: 2,
  name: "Test",
  description: "",
  author: "",
  tokens: { "--color-surface-page": { light: "#ffffff", dark: "#000000" } },
};

describe("setTokenColor", () => {
  it("sets one appearance and keeps the other", () => {
    const edited = setTokenColor(
      theme,
      "--color-surface-page",
      "dark",
      "#111111",
    );

    expect(edited.tokens["--color-surface-page"]).toEqual({
      light: "#ffffff",
      dark: "#111111",
    });
  });

  it("falls back to Caido's color when the value is cleared", () => {
    const edited = setTokenColor(theme, "--color-surface-page", "dark", "");

    expect(buildThemeCss(edited)).not.toContain('data-mode="dark"');
  });

  it("does not change the original theme", () => {
    setTokenColor(theme, "--color-surface-page", "dark", "#111111");

    expect(theme.tokens["--color-surface-page"]?.dark).toBe("#000000");
  });
});

describe("usedColors", () => {
  it("lists each color the theme sets once, for one appearance", () => {
    const edited = setTokenColor(
      theme,
      "--color-surface-subtle",
      "dark",
      "#000000",
    );

    expect(usedColors(edited, "dark")).toEqual(["#000000"]);
    expect(usedColors(edited, "light")).toEqual(["#ffffff"]);
  });
});

describe("isSameTheme", () => {
  it("treats a color that was set and cleared again as unchanged", () => {
    const edited = setTokenColor(
      setTokenColor(theme, "--color-fg-default", "dark", "#123456"),
      "--color-fg-default",
      "dark",
      "",
    );

    expect(edited.tokens["--color-fg-default"]).toBeUndefined();
    expect(isSameTheme(edited, theme)).toBe(true);
  });

  it("ignores the order tokens were set in", () => {
    const cleared = setTokenColor(theme, "--color-surface-page", "dark", "");
    const reordered = setTokenColor(
      cleared,
      "--color-surface-page",
      "dark",
      "#000000",
    );

    expect(isSameTheme(reordered, theme)).toBe(true);
  });

  it("notices a changed color or name", () => {
    expect(
      isSameTheme(
        setTokenColor(theme, "--color-surface-page", "dark", "#111111"),
        theme,
      ),
    ).toBe(false);
    expect(isSameTheme({ ...theme, name: "Other" }, theme)).toBe(false);
  });
});
