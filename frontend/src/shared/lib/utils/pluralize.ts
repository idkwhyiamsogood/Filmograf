const pluralRules = new Intl.PluralRules("ru-RU");

/**
 * Склоняет слово по числу: pluralize(5, ["фильм", "фильма", "фильмов"]) → "5 фильмов".
 */
/** Только слово в нужной форме: pluralWord(5, [...]) → "фильмов". */
export const pluralWord = (
  count: number,
  [one, few, many]: [one: string, few: string, many: string],
): string => {
  const form = pluralRules.select(count);
  return form === "one" ? one : form === "few" ? few : many;
};

export const pluralize = (
  count: number,
  [one, few, many]: [one: string, few: string, many: string],
): string => {
  const form = pluralRules.select(count);
  const word = form === "one" ? one : form === "few" ? few : many;
  return `${count} ${word}`;
};
