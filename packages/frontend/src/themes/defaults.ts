import manifest from "@caido/tokens/tokens.json";
import { type Mode, oklchToHex, type ThemeToken } from "shared";

type ManifestToken = {
  variable: string;
  light?: string;
  dark?: string;
};

const manifestTokens: Record<string, ManifestToken> = manifest.tokens;

const defaultsByVariable = new Map(
  Object.values(manifestTokens).map((token) => [token.variable, token]),
);

export const caidoDefaultColor = (token: ThemeToken, mode: Mode) => {
  const value = defaultsByVariable.get(token)?.[mode];
  return value === undefined ? undefined : oklchToHex(value);
};
