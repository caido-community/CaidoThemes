import type { ThemeContent, ThemeV1 } from "./schemas";

type SurfaceColors = {
  page: string;
  subtle: string;
  raised: string;
};

const surfaces = (light: SurfaceColors, dark: SurfaceColors) => ({
  "--color-surface-page": { light: light.page, dark: dark.page },
  "--color-surface-subtle": { light: light.subtle, dark: dark.subtle },
  "--color-surface-raised": { light: light.raised, dark: dark.raised },
});

export const PRESETS: ThemeContent[] = [
  {
    version: 2,
    name: "Default",
    description: "The default Caido theme",
    author: "Caido",
    tokens: {},
  },
  {
    version: 2,
    name: "Dark Gray",
    description:
      "For hackers who like their themes as dark as their intentions",
    author: "bebiks",
    tokens: surfaces(
      { page: "#f7f7f7", subtle: "#eeeeee", raised: "#e2e2e2" },
      { page: "#262626", subtle: "#2b2b2b", raised: "#333333" },
    ),
  },
  {
    version: 2,
    name: "Even Darker",
    description: "So dark, you might lose your mouse cursor",
    author: "bebiks",
    tokens: surfaces(
      { page: "#ffffff", subtle: "#f4f4f4", raised: "#e9e9e9" },
      { page: "#000000", subtle: "#121111", raised: "#151414" },
    ),
  },
  {
    version: 2,
    name: "Coffee Stain",
    description: "A dark theme inspired by your favorite brew",
    author: "bebiks",
    tokens: surfaces(
      { page: "#fff4eb", subtle: "#faebdf", raised: "#f0dfd1" },
      { page: "#2e241f", subtle: "#332924", raised: "#3c312c" },
    ),
  },
  {
    version: 2,
    name: "Ocean Blue",
    description: "For when you want your screen to look like a fish tank",
    author: "bebiks",
    tokens: surfaces(
      { page: "#eef8ff", subtle: "#e3effd", raised: "#d5e4f4" },
      { page: "#18293a", subtle: "#1d2e3f", raised: "#253648" },
    ),
  },
  {
    version: 2,
    name: "Forest Green",
    description: "Perfect for pretending you're outside while testing indoors",
    author: "bebiks",
    tokens: surfaces(
      { page: "#effaf1", subtle: "#e4f2e6", raised: "#d6e8d9" },
      { page: "#122e18", subtle: "#18341d", raised: "#203c25" },
    ),
  },
  {
    version: 2,
    name: "Sunset Orange",
    description: "Caido, but make it pumpkin spice",
    author: "bebiks",
    tokens: surfaces(
      { page: "#fff5ea", subtle: "#f9ebdf", raised: "#efdfd0" },
      { page: "#332414", subtle: "#392919", raised: "#413121" },
    ),
  },
  {
    version: 2,
    name: "Lavender",
    description:
      "For researchers who want their proxy to smell like a fancy soap shop",
    author: "bebiks",
    tokens: surfaces(
      { page: "#f9f4ff", subtle: "#f1eafa", raised: "#e6def1" },
      { page: "#2a1a3a", subtle: "#2f1f40", raised: "#372748" },
    ),
  },
  {
    version: 2,
    name: "Midnight in Seoul",
    description: "A theme inspired by the deep blue hues of Seoul at midnight",
    author: "hahwul",
    tokens: {
      ...surfaces(
        { page: "#ecf9ff", subtle: "#e0f1fb", raised: "#d2e6f2" },
        { page: "#081721", subtle: "#0d1c26", raised: "#14242e" },
      ),
      "--color-fill-primary": { dark: "#30465a" },
      "--color-fg-on-primary": { dark: "#ffffff" },
      "--color-fill-neutral-subtle": { dark: "#31516d" },
      "--color-fg-on-neutral-subtle": { dark: "#ffffff" },
    },
  },
  {
    version: 2,
    name: "Nightfall",
    description: "Deep space black with electric violet accents",
    author: "six2dez",
    tokens: {
      ...surfaces(
        { page: "#f2f7ff", subtle: "#e7eefe", raised: "#dbe2f5" },
        { page: "#0c0e14", subtle: "#101319", raised: "#181a20" },
      ),
      "--color-fill-primary": { dark: "#6d5cff" },
      "--color-fg-on-primary": { dark: "#ffffff" },
      "--color-fill-secondary": { dark: "#1c2030" },
      "--color-fg-on-secondary": { dark: "#c8c8d0" },
      "--color-fill-neutral-subtle": { dark: "#363c50" },
      "--color-fg-on-neutral-subtle": { dark: "#c8c8d0" },
    },
  },
  {
    version: 2,
    name: "Monokai Remastered",
    description: "Modern Monokai with purple-warm undertones",
    author: "six2dez",
    tokens: {
      ...surfaces(
        { page: "#faf4fc", subtle: "#f2ebf5", raised: "#e7dfea" },
        { page: "#29262a", subtle: "#2e2b2f", raised: "#363337" },
      ),
      "--color-fill-primary": { dark: "#ff6188" },
      "--color-fg-on-primary": { dark: "#2d2a2e" },
      "--color-fill-secondary": { dark: "#403e41" },
      "--color-fg-on-secondary": { dark: "#f8f8f2" },
      "--color-fill-neutral-subtle": { dark: "#727072" },
      "--color-fg-on-neutral-subtle": { dark: "#f8f8f2" },
    },
  },
];

const LEGACY_PRESET_COLORS: Record<string, string> = {
  Default: "#25272d #353942 #2f323a",
  "Dark Gray": "#262626 #3a3a3a #303030",
  "Even Darker": "#000000 #121111 #151414",
  "Coffee Stain": "#2e241f #4d3e32 #3a3027",
  "Ocean Blue": "#1a2b3c #3a5a7a #2c4a6a",
  "Forest Green": "#1e3a23 #3c7a4d #2c5a3d",
  "Sunset Orange": "#3a2a1a #7a5a3a #5a4a2a",
  Lavender: "#2a1a3a #5a3a7a #4a2a5a",
  "Midnight in Seoul":
    "#081721 #182730 #122231 #30465a #000000 #000000 #31516d",
  Nightfall:
    "#0c0e14 #111520 #171b24 #6d5cff #e8e8ee #1c2030 #c8c8d0 #363c50 #c8c8d0",
  "Monokai Remastered":
    "#2d2a2e #353236 #403e41 #ff6188 #f8f8f2 #403e41 #f8f8f2 #727072 #f8f8f2",
};

const legacyColors = ({ primary, button }: ThemeV1) =>
  [
    primary.dark,
    primary.light,
    primary.subtle,
    button?.primary?.bg,
    button?.primary?.text,
    button?.secondary?.bg,
    button?.secondary?.text,
    button?.tertiary?.bg,
    button?.tertiary?.text,
  ]
    .filter((color) => typeof color === "string" && color !== "")
    .join(" ")
    .toLowerCase();

export const findUneditedPreset = (theme: ThemeV1) => {
  if (LEGACY_PRESET_COLORS[theme.name] !== legacyColors(theme)) {
    return undefined;
  }

  return PRESETS.find((preset) => preset.name === theme.name);
};
