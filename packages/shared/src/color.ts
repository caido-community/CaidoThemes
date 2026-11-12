type Oklch = {
  l: number;
  c: number;
  h: number;
};

type Rgb = [number, number, number];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toLinear = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

const toGamma = (channel: number) =>
  channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055;

const expandHex = (hex: string) => {
  const digits = hex.slice(1);
  return digits.length === 3
    ? [...digits].map((digit) => digit + digit).join("")
    : digits;
};

const parseHex = (hex: string) => {
  const digits = expandHex(hex);
  const channel = (start: number) =>
    parseInt(digits.slice(start, start + 2), 16) / 255;

  const rgb: Rgb = [channel(0), channel(2), channel(4)];
  return { rgb, alpha: digits.slice(6) };
};

const toHexByte = (value: number) =>
  Math.round(clamp(value, 0, 1) * 255)
    .toString(16)
    .padStart(2, "0");

const formatHex = (rgb: Rgb, alpha: string) =>
  `#${rgb.map(toHexByte).join("")}${alpha}`;

const rgbToOklch = ([red, green, blue]: Rgb): Oklch => {
  const [r, g, b] = [toLinear(red), toLinear(green), toLinear(blue)];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bAxis = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  return {
    l: lightness,
    c: Math.hypot(a, bAxis),
    h: Math.atan2(bAxis, a),
  };
};

const oklchToRgb = ({ l: lightness, c, h }: Oklch): Rgb => {
  const a = c * Math.cos(h);
  const bAxis = c * Math.sin(h);

  const l = (lightness + 0.3963377774 * a + 0.2158037573 * bAxis) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * bAxis) ** 3;
  const s = (lightness - 0.0894841694 * a - 1.291485548 * bAxis) ** 3;

  return [
    toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
};

export const adjustLightness = (hex: string, delta: number) => {
  const { rgb, alpha } = parseHex(hex);
  const color = rgbToOklch(rgb);
  const adjusted = { ...color, l: clamp(color.l + delta, 0, 1) };
  return formatHex(oklchToRgb(adjusted), alpha);
};

const toOpaqueHex = (hex: string) => `#${expandHex(hex).slice(0, 6)}`;

const OKLCH_PATTERN =
  /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)\s*)?\)$/;

export const oklchToHex = (value: string) => {
  const match = OKLCH_PATTERN.exec(value.trim());
  if (match === null) {
    return undefined;
  }

  const [, lightness, chroma, hue, alpha] = match;
  const rgb = oklchToRgb({
    l: Number(lightness),
    c: Number(chroma),
    h: (Number(hue) * Math.PI) / 180,
  });
  return formatHex(rgb, alpha === undefined ? "" : toHexByte(Number(alpha)));
};

export const withAlpha = (hex: string, alpha: number) =>
  `${toOpaqueHex(hex)}${toHexByte(alpha)}`;
