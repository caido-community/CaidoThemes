import type { ThemeContent } from "./schemas";
import { type Mode, THEME_TOKENS, type ThemeToken } from "./tokens";

export const setTokenColor = <T extends ThemeContent>(
  theme: T,
  token: ThemeToken,
  mode: Mode,
  color: string,
): T => ({
  ...theme,
  tokens: {
    ...theme.tokens,
    [token]: {
      ...theme.tokens[token],
      [mode]: color === "" ? undefined : color,
    },
  },
});

export const usedColors = (theme: ThemeContent, mode: Mode) => [
  ...new Set(
    THEME_TOKENS.flatMap((token) => theme.tokens[token]?.[mode] ?? []).map(
      (color) => color.toLowerCase(),
    ),
  ),
];
