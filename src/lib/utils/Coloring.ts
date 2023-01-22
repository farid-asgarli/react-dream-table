import { StringExtensions } from "../extensions/String";

type RGBPalette = {
  [P in "r" | "g" | "b" | "a"]: number;
};

export function luminateColor(hex: string, lum: number) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, "");
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#",
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}

export function lightenColor(color: string) {
  let rgbValue: RGBPalette | null = null;
  if (color.startsWith("#")) {
    rgbValue = hexToRgb(color);
  } else if (color.startsWith("rgb")) {
    rgbValue = rgbToObject(color);
  }
  return paletteToString({ ...rgbValue!, a: 20 });
}

export function generateRGB(val: string, amount: number) {
  if (val.startsWith("rgb")) {
    const result = rgbToObject(val);
    return paletteToString(mixColors(result!, result!, amount));
  } else if (val.startsWith("#")) {
    const result = hexToRgb(val);
    return paletteToString(mixColors(result!, result!, amount));
  }
  return StringExtensions.Empty;
}
function paletteToString({ r, g, b, a }: RGBPalette) {
  return `rgb(${r} ${g} ${b} / ${a}%)`;
}

function rgbToObject(val: string) {
  const result = val.match(/\d+/g)?.map(Number);
  return result
    ? {
        r: result[0],
        g: result[1],
        b: result[2],
        a: result[3],
      }
    : null;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 100,
      }
    : null;
}

/**
 * Ported from sass implementation in C
 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
 */
function mixColors(color1: RGBPalette, color2: RGBPalette, amount: number) {
  const weight1 = amount;
  const weight2 = 1 - amount;

  const r = Math.round(weight1 * color1.r + weight2 * color2.r);
  const g = Math.round(weight1 * color1.g + weight2 * color2.g);
  const b = Math.round(weight1 * color1.b + weight2 * color2.b);
  const a = Math.round(weight1 * color1.a + weight2 * color2.a);

  return { r, g, b, a };
}
