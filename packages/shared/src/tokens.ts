import type { TokenName } from "@caido/tokens";

export const MODES = ["light", "dark"] as const;
export type Mode = (typeof MODES)[number];

const BACKGROUND_TOKENS = [
  "--color-surface-page",
  "--color-surface-subtle",
  "--color-surface-raised",
  "--color-surface-hover",
  "--color-surface-selected",
] as const satisfies readonly TokenName[];

const TEXT_TOKENS = [
  "--color-fg-default",
  "--color-fg-strong",
  "--color-fg-subtle",
  "--color-fg-muted",
  "--color-fg-link",
] as const satisfies readonly TokenName[];

const BORDER_TOKENS = [
  "--color-line-subtle",
  "--color-line-default",
  "--color-line-strong",
] as const satisfies readonly TokenName[];

const ACCENT_TOKENS = [
  "--color-fg-secondary",
  "--color-line-selected",
  "--color-line-focus",
  "--color-surface-selection",
  "--color-surface-selection-focus",
] as const satisfies readonly TokenName[];

const BUTTON_TOKENS = [
  "--color-fill-primary",
  "--color-fg-on-primary",
  "--color-fill-secondary",
  "--color-fg-on-secondary",
  "--color-fill-neutral-subtle",
  "--color-fg-on-neutral-subtle",
] as const satisfies readonly TokenName[];

export const SYNTAX_TOKENS = [
  "--color-syntax-string",
  "--color-syntax-number",
  "--color-syntax-boolean",
  "--color-syntax-constant",
  "--color-syntax-property",
  "--color-syntax-name",
  "--color-syntax-attribute",
  "--color-syntax-header-name",
  "--color-syntax-cookie-value",
  "--color-syntax-version",
  "--color-syntax-punctuation",
  "--color-syntax-meta",
  "--color-syntax-comment",
  "--color-syntax-query-comment",
] as const satisfies readonly TokenName[];

export type SyntaxToken = (typeof SYNTAX_TOKENS)[number];

export const THEME_TOKENS = [
  ...BACKGROUND_TOKENS,
  ...TEXT_TOKENS,
  ...BORDER_TOKENS,
  ...ACCENT_TOKENS,
  ...BUTTON_TOKENS,
  ...SYNTAX_TOKENS,
] as const;
export type ThemeToken = (typeof THEME_TOKENS)[number];

export const TOKEN_GROUPS: { title: string; tokens: readonly ThemeToken[] }[] =
  [
    { title: "Backgrounds", tokens: BACKGROUND_TOKENS },
    { title: "Text", tokens: TEXT_TOKENS },
    { title: "Borders", tokens: BORDER_TOKENS },
    { title: "Accent", tokens: ACCENT_TOKENS },
    { title: "Buttons", tokens: BUTTON_TOKENS },
    { title: "Editor syntax", tokens: SYNTAX_TOKENS },
  ];

export const TOKEN_LABELS: Record<ThemeToken, string> = {
  "--color-surface-page": "Page",
  "--color-surface-subtle": "Striped rows",
  "--color-surface-raised": "Panels and menus",
  "--color-surface-hover": "Hovered item",
  "--color-surface-selected": "Selected item",
  "--color-fg-default": "Default text",
  "--color-fg-strong": "Headings",
  "--color-fg-subtle": "Secondary text",
  "--color-fg-muted": "Hints and placeholders",
  "--color-fg-link": "Links",
  "--color-line-subtle": "Dividers",
  "--color-line-default": "Borders",
  "--color-line-strong": "Strong borders",
  "--color-fg-secondary": "Accent",
  "--color-line-selected": "Selected item border",
  "--color-line-focus": "Focus ring",
  "--color-surface-selection": "Text selection",
  "--color-surface-selection-focus": "Text selection, focused",
  "--color-fill-primary": "Primary button",
  "--color-fg-on-primary": "Primary button text",
  "--color-fill-secondary": "Secondary button",
  "--color-fg-on-secondary": "Secondary button text",
  "--color-fill-neutral-subtle": "Default button",
  "--color-fg-on-neutral-subtle": "Default button text",
  "--color-syntax-string": "Strings and request paths",
  "--color-syntax-number": "Numbers, tags and class names",
  "--color-syntax-boolean": "Booleans, keywords and variables",
  "--color-syntax-constant": "Constants, null and HTTP methods",
  "--color-syntax-property": "JSON keys and query parameters",
  "--color-syntax-name": "Names and literals",
  "--color-syntax-attribute": "Attributes and cookie names",
  "--color-syntax-header-name": "Header names",
  "--color-syntax-cookie-value": "Cookie values",
  "--color-syntax-version": "HTTP version",
  "--color-syntax-punctuation": "Punctuation",
  "--color-syntax-meta": "Meta and separators",
  "--color-syntax-comment": "Comments",
  "--color-syntax-query-comment": "Comments in queries",
};

type Derivation = {
  token: TokenName;
  from: TokenName;
  lightness: Record<Mode, number>;
  alpha?: number;
};

const SAME_LIGHTNESS = { light: 0, dark: 0 };
const BUTTON_HOVER = { light: -0.04, dark: 0.06 };
const ACCENT_STRONG = { light: -0.16, dark: 0.051 };
const ACCENT_FILL = { light: 0.238, dark: -0.039 };

export const DERIVATIONS: Derivation[] = [
  {
    token: "--color-surface-hover",
    from: "--color-surface-raised",
    lightness: { light: -0.031, dark: 0.024 },
  },
  {
    token: "--color-surface-selected",
    from: "--color-surface-raised",
    lightness: { light: -0.058, dark: 0.046 },
  },
  {
    token: "--color-line-subtle",
    from: "--color-surface-page",
    lightness: { light: -0.164, dark: 0.134 },
  },
  {
    token: "--color-line-default",
    from: "--color-surface-page",
    lightness: { light: -0.224, dark: 0.181 },
  },
  {
    token: "--color-line-strong",
    from: "--color-surface-page",
    lightness: { light: -0.338, dark: 0.28 },
  },
  {
    token: "--color-fill-neutral-subtle",
    from: "--color-surface-raised",
    lightness: { light: -0.162, dark: 0.128 },
  },
  {
    token: "--color-fill-neutral-subtle-hover",
    from: "--color-fill-neutral-subtle",
    lightness: { light: -0.114, dark: 0.099 },
  },
  {
    token: "--color-fill-neutral",
    from: "--color-surface-raised",
    lightness: { light: -0.316, dark: 0.271 },
  },
  {
    token: "--color-fill-neutral-hover",
    from: "--color-fill-neutral",
    lightness: { light: -0.034, dark: 0.037 },
  },
  {
    token: "--color-fill-primary-hover",
    from: "--color-fill-primary",
    lightness: BUTTON_HOVER,
  },
  {
    token: "--color-fill-secondary",
    from: "--color-fg-secondary",
    lightness: ACCENT_FILL,
  },
  {
    token: "--color-fill-secondary-hover",
    from: "--color-fill-secondary",
    lightness: BUTTON_HOVER,
  },
  {
    token: "--color-fg-secondary-strong",
    from: "--color-fg-secondary",
    lightness: ACCENT_STRONG,
  },
  {
    token: "--color-line-selected",
    from: "--color-fg-secondary",
    lightness: SAME_LIGHTNESS,
  },
  {
    token: "--color-line-secondary",
    from: "--color-fg-secondary",
    lightness: SAME_LIGHTNESS,
  },
  {
    token: "--color-line-focus",
    from: "--color-fg-secondary",
    lightness: ACCENT_STRONG,
  },
  {
    token: "--color-surface-secondary",
    from: "--color-fg-secondary",
    lightness: { light: 0.395, dark: -0.366 },
  },
  {
    token: "--color-surface-selection",
    from: "--color-fg-secondary",
    lightness: ACCENT_FILL,
    alpha: 0.16,
  },
  {
    token: "--color-surface-selection-focus",
    from: "--color-fg-secondary",
    lightness: ACCENT_FILL,
    alpha: 0.24,
  },
];
