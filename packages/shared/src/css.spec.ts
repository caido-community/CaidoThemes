import { describe, expect, it } from "vitest";

import { buildThemeCss, derivedColor, derivedFrom } from "./css";
import type { ThemeContent } from "./schemas";

const theme = (tokens: ThemeContent["tokens"]): ThemeContent => ({
  version: 2,
  name: "Test",
  description: "",
  author: "",
  tokens,
});

describe("buildThemeCss", () => {
  it("returns nothing for a theme without overrides", () => {
    expect(buildThemeCss(theme({}))).toBe("");
  });

  it("writes one rule per appearance that has values", () => {
    const css = buildThemeCss(
      theme({ "--color-fg-default": { light: "#111111", dark: "#eeeeee" } }),
    );

    expect(css).toBe(
      [
        ':root[data-mode="light"] {',
        "  --color-fg-default: #111111;",
        "}",
        "",
        ':root[data-mode="dark"] {',
        "  --color-fg-default: #eeeeee;",
        "}",
      ].join("\n"),
    );
  });

  it("leaves the light appearance alone for a dark only theme", () => {
    const css = buildThemeCss(
      theme({ "--color-surface-page": { dark: "#000000" } }),
    );

    expect(css).not.toContain('data-mode="light"');
  });

  it("derives button hovers in the direction of each appearance", () => {
    const css = buildThemeCss(
      theme({ "--color-fill-primary": { light: "#aa0000", dark: "#bb0000" } }),
    );

    expect(css).toContain("--color-fill-primary-hover: #9c0000;");
    expect(css).toContain("--color-fill-primary-hover: #d1291e;");
  });

  it("derives hover, selected and borders from the theme surfaces", () => {
    const css = buildThemeCss(
      theme({
        "--color-surface-page": { dark: "#101010" },
        "--color-surface-raised": { dark: "#202020" },
      }),
    );

    expect(css).toContain("--color-surface-hover: #262626;");
    expect(css).toContain("--color-surface-selected: #2b2b2b;");
    expect(css).toContain("--color-line-subtle: #2f2f2f;");
  });

  it("prefers a color the user set over a derived one", () => {
    const css = buildThemeCss(
      theme({
        "--color-surface-raised": { dark: "#202020" },
        "--color-surface-hover": { dark: "#ff0000" },
      }),
    );

    expect(css).toContain("--color-surface-hover: #ff0000;");
    expect(css).not.toContain("--color-surface-hover: #262626;");
  });
});

describe("derivedFrom", () => {
  it("names the token a missing color follows", () => {
    const tokens = { "--color-surface-raised": { dark: "#202020" } };

    expect(derivedFrom(tokens, "--color-surface-hover", "dark")).toBe(
      "--color-surface-raised",
    );
    expect(
      derivedFrom(tokens, "--color-surface-hover", "light"),
    ).toBeUndefined();
  });
});

describe("derivedColor", () => {
  it("returns the color a missing token takes from the theme", () => {
    const tokens = { "--color-surface-raised": { dark: "#202020" } };

    expect(derivedColor(tokens, "--color-surface-hover", "dark")).toBe(
      "#262626",
    );
    expect(derivedColor(tokens, "--color-line-subtle", "dark")).toBeUndefined();
  });
});
