import { describe, expect, it } from "vitest";

import { buildThemeCss } from "./css";
import { setTokenColor } from "./edit";
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
