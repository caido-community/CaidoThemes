type EyeDropperResult = {
  sRGBHex: string;
};

declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<EyeDropperResult> };
  }
}

export {};
