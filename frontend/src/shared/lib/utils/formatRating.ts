/** Рейтинг всегда с одним знаком после запятой: 9 → "9.0". */
export const formatRating = (value: number | undefined | null): string =>
  typeof value === "number" && value > 0 ? value.toFixed(1) : "—";
