import type { ThemeContent, ThemeV1 } from "./schemas";
import type { SyntaxToken } from "./tokens";

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

const accent = (light: string, dark: string) => ({
  "--color-fg-secondary": { light, dark },
});

const syntax = (colors: Record<SyntaxToken, [light: string, dark: string]>) =>
  Object.fromEntries(
    Object.entries(colors).map(([token, [light, dark]]) => [
      token,
      { light, dark },
    ]),
  );

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
    tokens: {
      ...surfaces(
        { page: "#f7f7f7", subtle: "#eeeeee", raised: "#e2e2e2" },
        { page: "#262626", subtle: "#2b2b2b", raised: "#333333" },
      ),
      ...syntax({
        "--color-syntax-string": ["#495940", "#b9ccaf"],
        "--color-syntax-number": ["#26577f", "#6fa1cd"],
        "--color-syntax-boolean": ["#744b3a", "#c49683"],
        "--color-syntax-constant": ["#654982", "#cdaeef"],
        "--color-syntax-property": ["#6f4f0f", "#e0b265"],
        "--color-syntax-name": ["#3b5b3c", "#99be9a"],
        "--color-syntax-attribute": ["#97352e", "#e67c70"],
        "--color-syntax-header-name": ["#695110", "#f2c864"],
        "--color-syntax-cookie-value": ["#545454", "#ffffff"],
        "--color-syntax-version": ["#0e5d3f", "#66b18c"],
        "--color-syntax-punctuation": ["#545454", "#9d9d9d"],
        "--color-syntax-meta": ["#545454", "#a0a0a0"],
        "--color-syntax-comment": ["#3e5c31", "#84a577"],
        "--color-syntax-query-comment": ["#50545a", "#969ba2"],
      }),
    },
  },
  {
    version: 2,
    name: "Even Darker",
    description: "So dark, you might lose your mouse cursor",
    author: "bebiks",
    tokens: {
      ...surfaces(
        { page: "#ffffff", subtle: "#f4f4f4", raised: "#e9e9e9" },
        { page: "#000000", subtle: "#121111", raised: "#151414" },
      ),
      ...syntax({
        "--color-syntax-string": ["#495940", "#b9ccaf"],
        "--color-syntax-number": ["#26577f", "#699bc6"],
        "--color-syntax-boolean": ["#744b3a", "#c49683"],
        "--color-syntax-constant": ["#654982", "#cdaeef"],
        "--color-syntax-property": ["#6f4f0f", "#e0b265"],
        "--color-syntax-name": ["#3b5b3c", "#99be9a"],
        "--color-syntax-attribute": ["#97352e", "#db7267"],
        "--color-syntax-header-name": ["#695110", "#f2c864"],
        "--color-syntax-cookie-value": ["#545454", "#ffffff"],
        "--color-syntax-version": ["#0e5d3f", "#66b18c"],
        "--color-syntax-punctuation": ["#545454", "#8e8e8e"],
        "--color-syntax-meta": ["#545454", "#a0a0a0"],
        "--color-syntax-comment": ["#3e5c31", "#759568"],
        "--color-syntax-query-comment": ["#50545a", "#93989f"],
      }),
    },
  },
  {
    version: 2,
    name: "Coffee Stain",
    description: "A dark theme inspired by your favorite brew",
    author: "bebiks",
    tokens: {
      ...surfaces(
        { page: "#fff4eb", subtle: "#faebdf", raised: "#f0dfd1" },
        { page: "#2e241f", subtle: "#332924", raised: "#3c312c" },
      ),
      ...accent("#82440f", "#eda776"),
      ...syntax({
        "--color-syntax-string": ["#4f5832", "#c0cba1"],
        "--color-syntax-number": ["#2d5291", "#739ce1"],
        "--color-syntax-boolean": ["#7b482a", "#cc9274"],
        "--color-syntax-constant": ["#773c83", "#e3a2f0"],
        "--color-syntax-property": ["#7e4500", "#f8a645"],
        "--color-syntax-name": ["#425b25", "#a0be84"],
        "--color-syntax-attribute": ["#a52200", "#fa743e"],
        "--color-syntax-header-name": ["#7b4700", "#ffb830"],
        "--color-syntax-cookie-value": ["#5d524b", "#ffffff"],
        "--color-syntax-version": ["#125f22", "#67b36e"],
        "--color-syntax-punctuation": ["#5d524b", "#a69a93"],
        "--color-syntax-meta": ["#5d524b", "#aa9e96"],
        "--color-syntax-comment": ["#495a0c", "#8fa45b"],
        "--color-syntax-query-comment": ["#5c514b", "#a79b93"],
      }),
    },
  },
  {
    version: 2,
    name: "Ocean Blue",
    description: "For when you want your screen to look like a fish tank",
    author: "bebiks",
    tokens: {
      ...surfaces(
        { page: "#eef8ff", subtle: "#e3effd", raised: "#d5e4f4" },
        { page: "#18293a", subtle: "#1d2e3f", raised: "#253648" },
      ),
      ...accent("#005d8b", "#77c2f5"),
      ...syntax({
        "--color-syntax-string": ["#3b5c42", "#abd0b1"],
        "--color-syntax-number": ["#00588c", "#58a3db"],
        "--color-syntax-boolean": ["#7e433c", "#d08e85"],
        "--color-syntax-constant": ["#5a4899", "#beafff"],
        "--color-syntax-property": ["#6a5200", "#d9b835"],
        "--color-syntax-name": ["#1b6042", "#81c3a0"],
        "--color-syntax-attribute": ["#a6123e", "#ff6e86"],
        "--color-syntax-header-name": ["#635500", "#e5d025"],
        "--color-syntax-cookie-value": ["#4c565e", "#ffffff"],
        "--color-syntax-version": ["#00624c", "#20b79c"],
        "--color-syntax-punctuation": ["#4c565e", "#939fa7"],
        "--color-syntax-meta": ["#4c565e", "#97a2ab"],
        "--color-syntax-comment": ["#1a6135", "#68ac7b"],
        "--color-syntax-query-comment": ["#4b555d", "#949fa8"],
      }),
    },
  },
  {
    version: 2,
    name: "Forest Green",
    description: "Perfect for pretending you're outside while testing indoors",
    author: "bebiks",
    tokens: {
      ...surfaces(
        { page: "#effaf1", subtle: "#e4f2e6", raised: "#d6e8d9" },
        { page: "#122e18", subtle: "#18341d", raised: "#203c25" },
      ),
      ...accent("#206636", "#87cc95"),
      ...syntax({
        "--color-syntax-string": ["#405c3d", "#b0cfac"],
        "--color-syntax-number": ["#005d85", "#48abd7"],
        "--color-syntax-boolean": ["#784a23", "#c9956e"],
        "--color-syntax-constant": ["#5a4899", "#beafff"],
        "--color-syntax-property": ["#6a5200", "#d9b835"],
        "--color-syntax-name": ["#2e5f36", "#8dc193"],
        "--color-syntax-attribute": ["#a52300", "#fd783e"],
        "--color-syntax-header-name": ["#635500", "#e5d025"],
        "--color-syntax-cookie-value": ["#4e584f", "#ffffff"],
        "--color-syntax-version": ["#006131", "#54b57d"],
        "--color-syntax-punctuation": ["#4e584f", "#99a39a"],
        "--color-syntax-meta": ["#4e584f", "#99a49a"],
        "--color-syntax-comment": ["#2b602b", "#76ad74"],
        "--color-syntax-query-comment": ["#4d574f", "#96a198"],
      }),
    },
  },
  {
    version: 2,
    name: "Sunset Orange",
    description: "Caido, but make it pumpkin spice",
    author: "bebiks",
    tokens: {
      ...surfaces(
        { page: "#fff5ea", subtle: "#f9ebdf", raised: "#efdfd0" },
        { page: "#332414", subtle: "#392919", raised: "#413121" },
      ),
      ...accent("#844217", "#efa57b"),
      ...syntax({
        "--color-syntax-string": ["#4f5832", "#c0cba1"],
        "--color-syntax-number": ["#2d5291", "#769fe4"],
        "--color-syntax-boolean": ["#7c472c", "#cd9275"],
        "--color-syntax-constant": ["#773c83", "#e3a2f0"],
        "--color-syntax-property": ["#804400", "#faa548"],
        "--color-syntax-name": ["#425b25", "#a0be84"],
        "--color-syntax-attribute": ["#a62000", "#fb7345"],
        "--color-syntax-header-name": ["#7b4700", "#ffb830"],
        "--color-syntax-cookie-value": ["#5d524c", "#ffffff"],
        "--color-syntax-version": ["#125f22", "#67b36e"],
        "--color-syntax-punctuation": ["#5d524c", "#a79a93"],
        "--color-syntax-meta": ["#5d524c", "#aa9d96"],
        "--color-syntax-comment": ["#495a0c", "#8fa45b"],
        "--color-syntax-query-comment": ["#5d514b", "#a79b94"],
      }),
    },
  },
  {
    version: 2,
    name: "Lavender",
    description:
      "For researchers who want their proxy to smell like a fancy soap shop",
    author: "bebiks",
    tokens: {
      ...surfaces(
        { page: "#f9f4ff", subtle: "#f1eafa", raised: "#e6def1" },
        { page: "#2a1a3a", subtle: "#2f1f40", raised: "#372748" },
      ),
      ...accent("#644685", "#c8a8ef"),
      ...syntax({
        "--color-syntax-string": ["#3b5c42", "#abd0b1"],
        "--color-syntax-number": ["#2d5291", "#6d96da"],
        "--color-syntax-boolean": ["#7e433c", "#d08e85"],
        "--color-syntax-constant": ["#694290", "#d2a8ff"],
        "--color-syntax-property": ["#804400", "#fba449"],
        "--color-syntax-name": ["#1b6042", "#81c3a0"],
        "--color-syntax-attribute": ["#a6123e", "#f5647d"],
        "--color-syntax-header-name": ["#7b4700", "#ffb830"],
        "--color-syntax-cookie-value": ["#57525d", "#ffffff"],
        "--color-syntax-version": ["#00624c", "#20b79c"],
        "--color-syntax-punctuation": ["#57525d", "#9994a0"],
        "--color-syntax-meta": ["#57525d", "#a39ea9"],
        "--color-syntax-comment": ["#1a6135", "#61a575"],
        "--color-syntax-query-comment": ["#56525c", "#9a95a1"],
      }),
    },
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
      ...accent("#005e88", "#71c4f2"),
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
      ...accent("#524c8e", "#b1aff9"),
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
      ...accent("#695500", "#ceb867"),
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
