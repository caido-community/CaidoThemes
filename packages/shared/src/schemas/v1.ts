import { z } from "zod";

const LegacyColorSchema = z.string().nullish();

const LegacyButtonSchema = z
  .object({
    bg: LegacyColorSchema,
    text: LegacyColorSchema,
  })
  .nullish();

export const ThemeV1Schema = z.object({
  name: z.string(),
  description: z.string().nullish(),
  author: z.string().nullish(),
  primary: z.object({
    dark: LegacyColorSchema,
    light: LegacyColorSchema,
    subtle: LegacyColorSchema,
  }),
  button: z
    .object({
      primary: LegacyButtonSchema,
      secondary: LegacyButtonSchema,
      tertiary: LegacyButtonSchema,
    })
    .nullish(),
});

export type ThemeV1 = z.infer<typeof ThemeV1Schema>;
