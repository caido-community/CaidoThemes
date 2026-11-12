import type { ThemeContent } from "./schemas";
import type { Mode, ThemeToken } from "./tokens";

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
