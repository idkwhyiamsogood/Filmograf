/** "169 мин" | "169" → "2 ч 49 мин"; непонятный формат возвращаем как есть. */
export const formatDuration = (time?: string | null): string => {
  if (!time) return "";
  const minutes = Number.parseInt(time, 10);
  if (!Number.isFinite(minutes) || minutes <= 0) return time;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} мин`;
  return m ? `${h} ч ${m} мин` : `${h} ч`;
};
