import type { ThemeContent } from "shared";

export const downloadTheme = (content: ThemeContent) => {
  const blob = new Blob([JSON.stringify(content, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${content.name.toLowerCase().replace(/\s+/g, "-")}.json`;
  link.click();

  URL.revokeObjectURL(url);
};

export const pickThemeFile = () =>
  new Promise<File | undefined>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = () => resolve(input.files?.[0]);
    input.oncancel = () => resolve(undefined);
    input.click();
  });
