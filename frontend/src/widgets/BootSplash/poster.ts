/**
 * Раскладка заставки по макету Figma (filmograf, «A4 - 3», левая панель
 * 281×595): буква F из фраз — мачта из вертикальных строк, две перекладины
 * из горизонтальных. Montserrat ExtraBold, кегли разные.
 *
 * Координаты — в единицах панели макета; на экране они масштабируются.
 * Фразы на каждый запуск берутся случайно из пула слота, кегль подгоняется
 * под длину слота замером реальной ширины текста.
 */

export const PANEL = { w: 281, h: 595 };
export const FONT = "Montserrat";
const WEIGHT = 800;

interface Slot {
  /** h — горизонтальная строка, v — вертикальная (читается снизу вверх) */
  dir: "h" | "v";
  x: number;
  /** h: верх строки; v: низ строки */
  y: number;
  /** длина отсека вдоль строки */
  length: number;
  maxSize: number;
  upper: boolean;
  pool: string[];
}

const SLOTS: Slot[] = [
  // верхняя перекладина
  { dir: "h", x: 62, y: 4, length: 214, maxSize: 22, upper: true, pool: ["авторский выбор", "живые подборки", "кино на вечер"] },
  { dir: "h", x: 62, y: 22, length: 216, maxSize: 56, upper: true, pool: ["образы", "сюжеты", "эмоции", "герои"] },
  // средняя перекладина
  { dir: "h", x: 62, y: 172, length: 200, maxSize: 24, upper: false, pool: ["взгляд на кино", "что посмотреть?", "кино как плейлист"] },
  { dir: "h", x: 62, y: 196, length: 212, maxSize: 40, upper: true, pool: ["ощущения", "впечатления", "открытия"] },
  { dir: "h", x: 96, y: 232, length: 180, maxSize: 50, upper: true, pool: ["идеи", "мечты", "миры", "страхи"] },
  // мачта
  { dir: "v", x: 4, y: 566, length: 214, maxSize: 20, upper: true, pool: ["живые подборки :)", "кино как плейлисты", "авторский выбор"] },
  { dir: "v", x: 6, y: 344, length: 336, maxSize: 22, upper: false, pool: ["что посмотреть вообще!?", "о чём этот фильм?", "что посмотреть сегодня?"] },
  { dir: "v", x: 30, y: 560, length: 300, maxSize: 22, upper: false, pool: ["что почувствовать сегодня?", "кино под настроение", "смотреть вместе с друзьями"] },
  { dir: "v", x: 32, y: 200, length: 194, maxSize: 30, upper: true, pool: ["состояния", "атмосфера", "эмоции"] },
  { dir: "v", x: 56, y: 566, length: 280, maxSize: 62, upper: true, pool: ["истории", "сюжеты", "персонажи"] },
];

export interface PosterLine {
  dir: "h" | "v";
  text: string;
  x: number;
  y: number;
  size: number;
}

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

let ctx: CanvasRenderingContext2D | null = null;
const measure = (text: string) => {
  ctx ??= document.createElement("canvas").getContext("2d");
  if (!ctx) return text.length * 0.72;
  ctx.font = `${WEIGHT} 100px ${FONT}, Arial, sans-serif`;
  return ctx.measureText(text).width / 100;
};

/**
 * Ждём Montserrat (не дольше timeout). Образец с кириллицей обязателен:
 * Google Fonts режет шрифт по unicode-range, и без него грузится только
 * латиница — кегли считались бы по запасному шрифту и строки вылезали.
 */
export const loadPosterFont = (timeout = 1200) =>
  Promise.race([
    document.fonts?.load(`${WEIGHT} 40px ${FONT}`, "АБВГДЕЁЖЗИЙ абв?!:)").catch(() => undefined),
    new Promise((r) => setTimeout(r, timeout)),
  ]);

export const buildPoster = (): PosterLine[] => {
  // Одна фраза — один раз на постере (пулы слотов пересекаются).
  const used = new Set<string>();
  return SLOTS.map((slot) => {
    const free = slot.pool.filter((p) => !used.has(p.replace(/[^\p{L} ]/gu, "").trim()));
    const raw = pick(free.length ? free : slot.pool);
    used.add(raw.replace(/[^\p{L} ]/gu, "").trim());
    const text = slot.upper ? raw.toUpperCase() : raw;
    const size = Math.min(slot.maxSize, slot.length / measure(text));
    // Вертикальные строки: y — нижний край, текст идёт вверх.
    return { dir: slot.dir, text, x: slot.x, y: slot.y, size };
  });
};
