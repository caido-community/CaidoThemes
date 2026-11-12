import type { ThemeContent } from "./schemas";
import { MODES, type Mode, THEME_TOKENS, type ThemeToken } from "./tokens";

export const setTokenColor = <T extends ThemeContent>(
  theme: T,
  token: ThemeToken,
  mode: Mode,
  color: string,
): T => {
  const { [token]: current, ...otherTokens } = theme.tokens;
  const colors = { ...current, [mode]: color === "" ? undefined : color };
  const isEmpty = MODES.every((each) => colors[each] === undefined);

  return {
    ...theme,
    tokens: isEmpty ? otherTokens : { ...otherTokens, [token]: colors },
  };
};

export const isSameTheme = (a: ThemeContent, b: ThemeContent) =>
  a.name === b.name &&
  a.description === b.description &&
  a.author === b.author &&
  THEME_TOKENS.every((token) =>
    MODES.every((mode) => a.tokens[token]?.[mode] === b.tokens[token]?.[mode]),
  );

export const usedColors = (theme: ThemeContent, mode: Mode) => [
  ...new Set(
    THEME_TOKENS.flatMap((token) => theme.tokens[token]?.[mode] ?? []).map(
      (color) => color.toLowerCase(),
    ),
  ),
];
