import type { TokenName } from "@caido/tokens";

import { adjustLightness } from "./color";
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

const explicitDeclarations = (tokens: Tokens, mode: Mode) =>
  THEME_TOKENS.flatMap((token) => {
    const color = tokens[token]?.[mode];
    return color === undefined ? [] : [`${token}: ${color};`];
  });

const findDerivation = (tokens: Tokens, token: TokenName, mode: Mode) =>
  DERIVATIONS.find(
    (derivation) =>
      derivation.token === token &&
      tokens[derivation.from]?.[mode] !== undefined,
  );

export const derivedFrom = (tokens: Tokens, token: ThemeToken, mode: Mode) =>
  findDerivation(tokens, token, mode)?.from;

export const derivedColor = (tokens: Tokens, token: TokenName, mode: Mode) => {
  const derivation = findDerivation(tokens, token, mode);
  if (derivation === undefined) {
    return undefined;
  }

  const base = tokens[derivation.from]?.[mode];
  return base === undefined
    ? undefined
    : adjustLightness(base, derivation.lightness[mode]);
};

const derivedDeclarations = (tokens: Tokens, mode: Mode) =>
  DERIVATIONS.flatMap(({ token }) => {
    const color = derivedColor(tokens, token, mode);
    if (color === undefined || colorOf(tokens, token, mode) !== undefined) {
      return [];
    }

    return [`${token}: ${color};`];
  });

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
