const rtf = new Intl.RelativeTimeFormat("ru", { numeric: "auto" });

const STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

/** «только что», «5 минут назад», «вчера», «3 недели назад». */
export const formatRelative = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = (d.getTime() - Date.now()) / 1000;
  if (!Number.isFinite(diff)) return "";
  if (Math.abs(diff) < 60) return "только что";
  for (const [unit, sec] of STEPS) {
    if (Math.abs(diff) >= sec) return rtf.format(Math.round(diff / sec), unit);
  }
  return "только что";
};
