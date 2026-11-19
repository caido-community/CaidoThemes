import { z } from "zod";

import { error, ok, type Result } from "../result";
import { THEME_TOKENS } from "../tokens";

const HexColorSchema = z
  .string()
  .regex(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i, "Expected a hex color");

export const isHexColor = (value: unknown): value is string =>
  HexColorSchema.safeParse(value).success;

export const THEME_LIMITS = {
  name: 50,
  description: 300,
  author: 50,
};

const TokenColorsSchema = z.object({
  light: HexColorSchema.optional(),
  dark: HexColorSchema.optional(),
});

export const ThemeV2Schema = z.object({
  version: z.literal(2),
  name: z.string().trim().min(1).max(THEME_LIMITS.name),
  description: z.string().max(THEME_LIMITS.description),
  author: z.string().max(THEME_LIMITS.author),
  tokens: z.partialRecord(z.enum(THEME_TOKENS), TokenColorsSchema),
});

export type ThemeContent = z.infer<typeof ThemeV2Schema>;
export type Theme = ThemeContent & { id: string };

export const validateTheme = (input: unknown): Result<ThemeContent> => {
  const result = ThemeV2Schema.safeParse(input);
  return result.success
    ? ok(result.data)
    : error(z.prettifyError(result.error));
};
