export interface Palette {
  id: string;
  name: string;
  hue: number;
  chroma: number;
  /** Светлый акцент — текст на кнопках тёмный; иначе белый */
  darkText: boolean;
}

/** 10 акцентов приложения. Цвета в OKLCH — одинаковая «яркость» у всех. */
export const PALETTES: Palette[] = [
  { id: "amber", name: "Янтарь", hue: 58, chroma: 0.16, darkText: true },
  { id: "coral", name: "Коралл", hue: 33, chroma: 0.17, darkText: true },
  { id: "ruby", name: "Рубин", hue: 18, chroma: 0.19, darkText: false },
  { id: "rose", name: "Роза", hue: 355, chroma: 0.17, darkText: false },
  { id: "amethyst", name: "Аметист", hue: 305, chroma: 0.17, darkText: false },
  { id: "indigo", name: "Индиго", hue: 275, chroma: 0.17, darkText: false },
  { id: "ocean", name: "Океан", hue: 245, chroma: 0.15, darkText: false },
  { id: "teal", name: "Бирюза", hue: 195, chroma: 0.12, darkText: true },
  { id: "emerald", name: "Изумруд", hue: 158, chroma: 0.15, darkText: true },
  { id: "lime", name: "Лайм", hue: 125, chroma: 0.17, darkText: true },
];

export const DEFAULT_PALETTE = PALETTES[0];

export const paletteById = (id?: string) => PALETTES.find((p) => p.id === id) ?? DEFAULT_PALETTE;

const color = (l: number, c: number, h: number, alpha?: number) =>
  `oklch(${l} ${c} ${h}${alpha != null ? ` / ${alpha}%` : ""})`;

/** CSS-переменные акцента для светлой и тёмной темы. */
export const paletteVars = (p: Palette) => {
  const light = {
    primary: color(p.darkText ? 0.7 : 0.57, p.chroma, p.hue),
    fg: p.darkText ? color(0.2, 0.03, p.hue) : color(0.99, 0, 0),
  };
  const dark = {
    primary: color(p.darkText ? 0.78 : 0.68, p.chroma, p.hue),
    fg: p.darkText ? color(0.18, 0.03, p.hue) : color(0.99, 0, 0),
  };
  const block = (v: { primary: string; fg: string }, soft: number) =>
    `--primary:${v.primary};--primary-foreground:${v.fg};--ring:${v.primary};` +
    `--brand-soft:${v.primary.replace(")", ` / ${soft}%)`)};--sidebar-primary:${v.primary};`;
  return `:root{${block(light, 14)}--splash-h:${p.hue};}.dark{${block(dark, 16)}}`;
};

/** Детерминированный «случайный» акцент дня: меняется в полночь, не повторяет вчерашний. */
export const dailyPalette = (date = new Date()) => {
  const day = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  const pick = (d: number) => {
    let x = (d * 2654435761) % 4294967296;
    x ^= x >>> 15;
    return Math.abs(x) % PALETTES.length;
  };
  let index = pick(day);
  if (index === pick(day - 1)) index = (index + 1) % PALETTES.length;
  return PALETTES[index];
};
