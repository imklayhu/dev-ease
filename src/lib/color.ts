export type Rgb = { r: number; g: number; b: number };
export type Hsl = { h: number; s: number; l: number };

const clamp255 = (n: number) => Math.min(255, Math.max(0, Math.round(n)));

export function normalizeHex(input: string): string | null {
  const raw = input.trim();
  const m = raw.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!m) {
    return null;
  }

  const hex = m[1];
  if (hex.length === 3) {
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`.toLowerCase();
  }

  return `#${hex.toLowerCase()}`;
}

export function hexToRgb(hex: string): Rgb | null {
  const normalized = normalizeHex(hex);
  if (!normalized) {
    return null;
  }

  const n = Number.parseInt(normalized.slice(1), 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

export function rgbToHex(rgb: Rgb): string {
  const r = clamp255(rgb.r);
  const g = clamp255(rgb.g);
  const b = clamp255(rgb.b);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function parseRgbFunction(input: string): Rgb | null {
  const raw = input.trim();
  const m = raw.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (!m) {
    return null;
  }

  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);
  if (![r, g, b].every((v) => Number.isFinite(v))) {
    return null;
  }

  return { r: clamp255(r), g: clamp255(g), b: clamp255(b) };
}

export function parseHslFunction(input: string): Hsl | null {
  const raw = input.trim();
  const m = raw.match(
    /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/i,
  );
  if (!m) {
    return null;
  }

  const h = Number(m[1]);
  const s = Number(m[2]);
  const l = Number(m[3]);
  if (![h, s, l].every((v) => Number.isFinite(v))) {
    return null;
  }

  return { h: ((h % 360) + 360) % 360, s: Math.min(100, Math.max(0, s)), l: Math.min(100, Math.max(0, l)) };
}

export function rgbToHsl(rgb: Rgb): Hsl {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  const l = (max + min) / 2;

  if (d === 0) {
    return { h: 0, s: 0, l: Math.round(l * 1000) / 10 };
  }

  const s = d / (1 - Math.abs(2 * l - 1));

  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d) % 6;
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    default:
      h = (r - g) / d + 4;
  }

  h *= 60;
  if (h < 0) {
    h += 360;
  }

  return {
    h: Math.round(h * 10) / 10,
    s: Math.round(s * 1000) / 10,
    l: Math.round(l * 1000) / 10,
  };
}

export function hslToRgb(hsl: Hsl): Rgb {
  const h = ((hsl.h % 360) + 360) % 360;
  const s = Math.min(100, Math.max(0, hsl.s)) / 100;
  const l = Math.min(100, Math.max(0, hsl.l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (h < 60) {
    r1 = c;
    g1 = x;
  } else if (h < 120) {
    r1 = x;
    g1 = c;
  } else if (h < 180) {
    g1 = c;
    b1 = x;
  } else if (h < 240) {
    g1 = x;
    b1 = c;
  } else if (h < 300) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }

  return {
    r: clamp255((r1 + m) * 255),
    g: clamp255((g1 + m) * 255),
    b: clamp255((b1 + m) * 255),
  };
}

export function parseColorLoose(input: string): { rgb: Rgb; hsl: Hsl; hex: string } | { error: string } {
  const raw = input.trim();
  if (!raw) {
    return { error: "请输入颜色值" };
  }

  const hexRgb = hexToRgb(raw);
  if (hexRgb) {
    const hsl = rgbToHsl(hexRgb);
    return { rgb: hexRgb, hsl, hex: rgbToHex(hexRgb) };
  }

  const rgbParsed = parseRgbFunction(raw);
  if (rgbParsed) {
    const hsl = rgbToHsl(rgbParsed);
    return { rgb: rgbParsed, hsl, hex: rgbToHex(rgbParsed) };
  }

  const hslParsed = parseHslFunction(raw);
  if (hslParsed) {
    const rgb = hslToRgb(hslParsed);
    return { rgb, hsl: hslParsed, hex: rgbToHex(rgb) };
  }

  return { error: "无法解析：支持 #RGB/#RRGGBB、rgb()、hsl()" };
}
