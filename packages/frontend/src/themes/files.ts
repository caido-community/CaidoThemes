import { parseJson, type Theme } from "shared";

export const downloadTheme = ({ id: _id, ...content }: Theme) => {
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
  new Promise<unknown>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async () => {
      const file = input.files?.[0];
      resolve(file === undefined ? undefined : parseJson(await file.text()));
    };
    input.click();
  });
