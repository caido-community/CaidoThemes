import { describe, expect, it } from "vitest";

import { migrateTheme } from "./migrate";
import { PRESETS } from "./presets";

const legacyTheme = {
  name: "My theme",
  description: "Mine",
  author: "me",
  primary: { dark: "#101010", light: "#303030", subtle: "#202020" },
  button: {
    primary: { bg: "#aa0000", text: "#ffffff" },
    secondary: { bg: null, text: null },
    tertiary: { bg: "#444444", text: "" },
  },
};

describe("migrateTheme", () => {
  it("returns a v2 theme unchanged", () => {
    const theme = {
      version: 2,
      name: "Current",
      description: "",
      author: "",
      tokens: { "--color-surface-page": { light: "#ffffff", dark: "#000000" } },
    };

    expect(migrateTheme(theme)).toEqual(theme);
  });

  it("maps every legacy color to the dark appearance of its token", () => {
    expect(migrateTheme(legacyTheme)).toEqual({
      version: 2,
      name: "My theme",
      description: "Mine",
      author: "me",
      tokens: {
        "--color-surface-page": { dark: "#101010" },
        "--color-surface-subtle": { dark: "#202020" },
        "--color-surface-raised": { dark: "#303030" },
        "--color-fill-primary": { dark: "#aa0000" },
        "--color-fg-on-primary": { dark: "#ffffff" },
        "--color-fill-neutral-subtle": { dark: "#444444" },
      },
    });
  });

  it("drops legacy colors that are not hex colors", () => {
    const theme = {
      ...legacyTheme,
      primary: { dark: "red; } body { display: none", light: "", subtle: null },
      button: undefined,
    };

    expect(migrateTheme(theme)?.tokens).toEqual({});
  });

  it("fills a missing legacy description and author", () => {
    const theme = { ...legacyTheme, description: null, author: undefined };

    expect(migrateTheme(theme)).toMatchObject({ description: "", author: "" });
  });

  it("replaces an unedited legacy preset with its curated version", () => {
    const legacyOcean = {
      name: "Ocean Blue",
      description: "For when you want your screen to look like a fish tank",
      author: "bebiks",
      primary: { dark: "#1a2b3c", light: "#3a5a7a", subtle: "#2c4a6a" },
      button: {
        primary: { bg: null, text: null },
        secondary: { bg: null, text: null },
        tertiary: { bg: null, text: null },
      },
    };

    expect(migrateTheme(legacyOcean)).toEqual(
      PRESETS.find((preset) => preset.name === "Ocean Blue"),
    );
  });

  it("keeps the colors of an edited legacy preset", () => {
    const editedOcean = {
      name: "Ocean Blue",
      primary: { dark: "#000033", light: "#3a5a7a", subtle: "#2c4a6a" },
    };

    expect(migrateTheme(editedOcean)?.tokens).toMatchObject({
      "--color-surface-page": { dark: "#000033" },
    });
  });

  it("rejects data that matches no version", () => {
    expect(migrateTheme({ name: "No colors" })).toBeUndefined();
    expect(migrateTheme("not a theme")).toBeUndefined();
  });

  it("rejects a v2 theme with a color that is not hex", () => {
    const theme = {
      version: 2,
      name: "Injected",
      description: "",
      author: "",
      tokens: { "--color-surface-page": { dark: "red; } * { color: red" } },
    };

    expect(migrateTheme(theme)).toBeUndefined();
  });

  it("rejects a v2 theme with a token outside the allowlist", () => {
    const theme = {
      version: 2,
      name: "Palette",
      description: "",
      author: "",
      tokens: { "--palette-neutral-dark-1": { dark: "#000000" } },
    };

    expect(migrateTheme(theme)).toBeUndefined();
  });
});
