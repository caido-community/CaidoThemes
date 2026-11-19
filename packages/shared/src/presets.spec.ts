import { describe, expect, it } from "vitest";

import { PRESETS } from "./presets";
import { ThemeV2Schema } from "./schemas";
import { SYNTAX_TOKENS } from "./tokens";

describe("PRESETS", () => {
  it.each(PRESETS)("$name is a valid theme", (preset) => {
    expect(ThemeV2Schema.safeParse(preset).success).toBe(true);
  });

  it("keeps the default preset free of overrides", () => {
    expect(PRESETS[0]).toMatchObject({ name: "Default", tokens: {} });
  });

  it("gives every other preset a light and a dark surface", () => {
    const withoutBothSurfaces = PRESETS.slice(1).filter(
      ({ tokens }) =>
        tokens["--color-surface-page"]?.light === undefined ||
        tokens["--color-surface-page"]?.dark === undefined,
    );

    expect(withoutBothSurfaces).toEqual([]);
  });

  it("gives every built-in theme by bebiks a full syntax palette", () => {
    const missing = PRESETS.filter(({ author }) => author === "bebiks").flatMap(
      ({ name, tokens }) =>
        SYNTAX_TOKENS.filter(
          (token) =>
            tokens[token]?.light === undefined ||
            tokens[token]?.dark === undefined,
        ).map((token) => `${name} ${token}`),
    );

    expect(missing).toEqual([]);
  });
});
