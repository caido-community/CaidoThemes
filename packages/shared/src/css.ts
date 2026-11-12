import type { TokenName } from "@caido/tokens";

import { adjustLightness, withAlpha } from "./color";
import type { ThemeContent } from "./schemas";
import {
  DERIVATIONS,
  MODES,
  type Mode,
  THEME_TOKENS,
  type ThemeToken,
} from "./tokens";

type Tokens = ThemeContent["tokens"];

const isThemeToken = (token: string): token is ThemeToken =>
  THEME_TOKENS.some((themeToken) => themeToken === token);

const colorOf = (tokens: Tokens, token: string, mode: Mode) =>
  isThemeToken(token) ? tokens[token]?.[mode] : undefined;

const declaration = (token: TokenName, color: string | undefined) =>
  color === undefined ? [] : [`${token}: ${color};`];

const explicitDeclarations = (tokens: Tokens, mode: Mode) =>
  THEME_TOKENS.flatMap((token) => declaration(token, tokens[token]?.[mode]));

const findDerivation = (token: TokenName) =>
  DERIVATIONS.find((derivation) => derivation.token === token);

const resolvedColor = (
  tokens: Tokens,
  token: TokenName,
  mode: Mode,
): string | undefined =>
  colorOf(tokens, token, mode) ?? derivedColor(tokens, token, mode);

export const derivedColor = (
  tokens: Tokens,
  token: TokenName,
  mode: Mode,
): string | undefined => {
  const derivation = findDerivation(token);
  if (derivation === undefined) {
    return undefined;
  }

  const base = resolvedColor(tokens, derivation.from, mode);
  if (base === undefined) {
    return undefined;
  }

  const adjusted = adjustLightness(base, derivation.lightness[mode]);
  return derivation.alpha === undefined
    ? adjusted
    : withAlpha(adjusted, derivation.alpha);
};

export const derivedFrom = (tokens: Tokens, token: ThemeToken, mode: Mode) => {
  const derivation = findDerivation(token);
  if (derivation === undefined || !isThemeToken(derivation.from)) {
    return undefined;
  }

  return resolvedColor(tokens, derivation.from, mode) === undefined
    ? undefined
    : derivation.from;
};

const derivedDeclarations = (tokens: Tokens, mode: Mode) =>
  DERIVATIONS.flatMap(({ token }) =>
    colorOf(tokens, token, mode) === undefined
      ? declaration(token, derivedColor(tokens, token, mode))
      : [],
  );

export const buildThemeCss = (theme: ThemeContent) =>
  MODES.flatMap((mode) => {
    const lines = [
      ...explicitDeclarations(theme.tokens, mode),
      ...derivedDeclarations(theme.tokens, mode),
    ];
    if (lines.length === 0) {
      return [];
    }

    const body = lines.map((line) => `  ${line}`).join("\n");
    return [`:root[data-mode="${mode}"] {\n${body}\n}`];
  }).join("\n\n");
