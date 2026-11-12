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

const SYNTAX_TOKENS = [
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
  "--color-surface-subtle": "Subtle, such as striped rows",
  "--color-surface-raised": "Raised, such as panels and menus",
  "--color-surface-hover": "Hovered item",
  "--color-surface-selected": "Selected item",
  "--color-fg-default": "Default",
  "--color-fg-strong": "Strong, such as headings",
  "--color-fg-subtle": "Subtle",
  "--color-fg-muted": "Muted, such as hints and placeholders",
  "--color-fg-link": "Links",
  "--color-line-subtle": "Subtle, such as dividers",
  "--color-line-default": "Default",
  "--color-line-strong": "Strong",
  "--color-fg-secondary": "Active item text",
  "--color-line-selected": "Selected item border",
  "--color-line-focus": "Focus ring",
  "--color-surface-selection": "Text selection",
  "--color-surface-selection-focus": "Text selection in a focused editor",
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
  from: ThemeToken;
  lightness: Record<Mode, number>;
};

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
    token: "--color-fill-primary-hover",
    from: "--color-fill-primary",
    lightness: { light: -0.04, dark: 0.06 },
  },
  {
    token: "--color-fill-secondary-hover",
    from: "--color-fill-secondary",
    lightness: { light: -0.04, dark: 0.06 },
  },
  {
    token: "--color-fill-neutral-subtle-hover",
    from: "--color-fill-neutral-subtle",
    lightness: { light: -0.04, dark: 0.06 },
  },
];
