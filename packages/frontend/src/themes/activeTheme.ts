import { buildThemeCss, type Theme } from "shared";

const STORAGE_KEY = "caidothemes:theme";
const STYLE_ID = "caidothemes";

export const supportsDesignTokens = () =>
  getComputedStyle(document.documentElement)
    .getPropertyValue("--color-surface-page")
    .trim() !== "";

export const getActiveThemeId = () =>
  localStorage.getItem(STORAGE_KEY) ?? undefined;

const getStyleElement = () => {
  const existing = document.getElementById(STYLE_ID);
  if (existing !== null) {
    return existing;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  document.head.append(style);
  return style;
};

export const activateTheme = (theme: Theme) => {
  localStorage.setItem(STORAGE_KEY, theme.id);
  getStyleElement().textContent = buildThemeCss(theme);
};

export const deactivateTheme = () => {
  localStorage.removeItem(STORAGE_KEY);
  document.getElementById(STYLE_ID)?.remove();
};
