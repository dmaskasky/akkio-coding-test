const BASE_URL = "https://www.thecolorapi.com";

type ColorApiResponse = {
  hex: { value: string; clean: string };
  rgb: {
    fraction: { r: number; g: number; b: number };
    r: number;
    g: number;
    b: number;
    value: string;
  };
  hsl: {
    fraction: { h: number; s: number; l: number };
    h: number;
    s: number;
    l: number;
    value: string;
  };
  hsv?: {
    fraction: { h: number; s: number; v: number };
    value: string;
    h: number;
    s: number;
    v: number;
  };
  name: {
    value: string;
    closest_named_hex: string;
    exact_match_name: boolean;
    distance: number;
  };
  cmyk?: {
    fraction: { c: number; m: number; y: number; k: number };
    value: string;
    c: number;
    m: number;
    y: number;
    k: number;
  };
  XYZ?: {
    fraction: { X: number; Y: number; Z: number };
    value: string;
    X: number;
    Y: number;
    Z: number;
  };
  image?: { bare: string; named: string };
  contrast?: { value: string };
};

export type ColorSwatchData = {
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
};

export type { ColorApiResponse };

export async function fetchColorByHsl(
  h: number,
  s: number,
  l: number,
): Promise<ColorApiResponse> {
  const hsl = `${Math.round(h)},${Math.round(s)}%,${Math.round(l)}%`;
  const res = await fetch(
    `${BASE_URL}/id?format=json&hsl=${encodeURIComponent(hsl)}`,
  );
  if (!res.ok) {
    throw new Error(`Color API error: ${res.status}`);
  }
  const data: ColorApiResponse = await res.json();
  return data;
}

export async function fetchColorByHex(hex: string): Promise<ColorApiResponse> {
  const clean = hex.replace(/^#/, "");
  const res = await fetch(
    `${BASE_URL}/id?format=json&hex=${encodeURIComponent(clean)}`,
  );
  if (!res.ok) {
    throw new Error(`Color API error: ${res.status}`);
  }
  const data: ColorApiResponse = await res.json();
  return data;
}

export function toSwatch(res: ColorApiResponse): ColorSwatchData {
  return {
    name: res.name.value,
    hex: res.hex.value,
    rgb: { r: res.rgb.r, g: res.rgb.g, b: res.rgb.b },
    hsl: { h: res.hsl.h, s: res.hsl.s, l: res.hsl.l },
  };
}

/** Build Color API URL with id?format=html&hex=00FF00 scheme. */
export function colorApiIdUrl(
  hexClean: string,
  format: "html" | "json" | "svg" = "html",
): string {
  return `${BASE_URL}/id?format=${format}&hex=${encodeURIComponent(hexClean)}`;
}

/** Build Color API scheme URL: scheme?hex=00FF00&format=html */
export function colorApiSchemeUrl(hexClean: string): string {
  return `${BASE_URL}/scheme?hex=${encodeURIComponent(hexClean)}&format=html`;
}
