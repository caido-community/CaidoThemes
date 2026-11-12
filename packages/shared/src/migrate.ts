import { findUneditedPreset } from "./presets";
import {
  isHexColor,
  ThemeV1Schema,
  ThemeV2Schema,
  type ThemeContent,
  type ThemeV1,
} from "./schemas";
import type { ThemeToken } from "./tokens";

const darkTokens = (colors: [ThemeToken, unknown][]) =>
  Object.fromEntries(
    colors.flatMap(([token, color]) =>
      isHexColor(color) ? [[token, { dark: color }]] : [],
    ),
  );

const fromV1 = (theme: ThemeV1): ThemeContent => {
  const preset = findUneditedPreset(theme);
  if (preset !== undefined) {
    return preset;
  }

  const { primary, button } = theme;

  return {
    version: 2,
    name: theme.name,
    description: theme.description ?? "",
    author: theme.author ?? "",
    tokens: darkTokens([
      ["--color-surface-page", primary.dark],
      ["--color-surface-subtle", primary.subtle],
      ["--color-surface-raised", primary.light],
      ["--color-fill-primary", button?.primary?.bg],
      ["--color-fg-on-primary", button?.primary?.text],
      ["--color-fill-secondary", button?.secondary?.bg],
      ["--color-fg-on-secondary", button?.secondary?.text],
      ["--color-fill-neutral-subtle", button?.tertiary?.bg],
      ["--color-fg-on-neutral-subtle", button?.tertiary?.text],
    ]),
  };
};

export const migrateTheme = (stored: unknown) => {
  const v2 = ThemeV2Schema.safeParse(stored);
  if (v2.success) {
    return v2.data;
  }

  const v1 = ThemeV1Schema.safeParse(stored);
  if (v1.success) {
    return ThemeV2Schema.safeParse(fromV1(v1.data)).data;
  }

  return undefined;
};
