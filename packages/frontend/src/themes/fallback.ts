import {
  derivedColor,
  derivedFrom,
  type Mode,
  type ThemeContent,
  type ThemeToken,
  TOKEN_LABELS,
} from "shared";

import { caidoDefaultColor } from "@/themes/defaults";

export type ColorFallback = {
  color: string | undefined;
  status: string;
};

export const describeFallback = (
  theme: ThemeContent,
  token: ThemeToken,
  mode: Mode,
): ColorFallback => {
  const source = derivedFrom(theme.tokens, token, mode);
  if (source !== undefined) {
    return {
      color: derivedColor(theme.tokens, token, mode),
      status: `Follows ${TOKEN_LABELS[source]}`,
    };
  }

  return { color: caidoDefaultColor(token, mode), status: "Caido default" };
};
