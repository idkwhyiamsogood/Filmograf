import type { FilterState } from "../types/types";

type ValidationErrors = {
  fromYearTo?: string;
  fromGradeTo?: string;
};

function isEmpty(v: unknown) {
  return v === undefined || v === null || String(v).trim() === "";
}

function toInt(v: unknown) {
  if (isEmpty(v)) return undefined;
  const n = Number.parseInt(String(v), 10);
  return Number.isFinite(n) ? n : undefined;
}

function toFloat(v: unknown) {
  if (isEmpty(v)) return undefined;
  const n = Number.parseFloat(String(v));
  return Number.isFinite(n) ? n : undefined;
}

export function hasActiveFilters(filterState: FilterState): boolean {
  const fo = filterState.filterOptions;

  const genresActive =
    (fo.genres?.include?.length ?? 0) > 0 || (fo.genres?.exclude?.length ?? 0) > 0;
  const tagsActive =
    (fo.tags?.include?.length ?? 0) > 0 || (fo.tags?.exclude?.length ?? 0) > 0;

  const strictActive = Boolean(filterState.strictMatch);

  if (fo.targetType === "Collection") {
    return genresActive || tagsActive || strictActive;
  }

  const years = fo.fromYearTo ?? [];
  const grades = fo.fromGradeTo ?? [];
  const yearsActive =
    !isEmpty(years[0]) && !isEmpty(years[1]);
  const gradesActive =
    !isEmpty(grades[0]) && !isEmpty(grades[1]);
  const ageActive = (fo.ageRating?.length ?? 0) > 0;

  return genresActive || yearsActive || gradesActive || ageActive || strictActive;
}

export function validateFilters(filterState: FilterState): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  if (filterState.filterOptions.targetType === "Movie") {
    const [yFromRaw, yToRaw] = filterState.filterOptions.fromYearTo ?? [];
    const yFrom = toInt(yFromRaw);
    const yTo = toInt(yToRaw);

    const yearBothEmpty = isEmpty(yFromRaw) && isEmpty(yToRaw);
    const yearBothFilled = !isEmpty(yFromRaw) && !isEmpty(yToRaw);
    if (!yearBothEmpty && !yearBothFilled) {
      errors.fromYearTo = "Для диапазона лет заполните оба поля: От и До.";
    } else if (yearBothFilled) {
      const currentYear = new Date().getFullYear();
      if (yFrom === undefined || yTo === undefined) {
        errors.fromYearTo = "Год должен быть числом.";
      } else if (yFrom < 1888 || yTo > currentYear + 1) {
        errors.fromYearTo = `Год должен быть в диапазоне 1888–${currentYear + 1}.`;
      } else if (yFrom > yTo) {
        errors.fromYearTo = "Год 'От' не может быть больше года 'До'.";
      }
    }

    const [gFromRaw, gToRaw] = filterState.filterOptions.fromGradeTo ?? [];
    const gFrom = toFloat(gFromRaw);
    const gTo = toFloat(gToRaw);

    const gradeBothEmpty = isEmpty(gFromRaw) && isEmpty(gToRaw);
    const gradeBothFilled = !isEmpty(gFromRaw) && !isEmpty(gToRaw);
    if (!gradeBothEmpty && !gradeBothFilled) {
      errors.fromGradeTo = "Для диапазона оценки заполните оба поля: От и До.";
    } else if (gradeBothFilled) {
      if (gFrom === undefined || gTo === undefined) {
        errors.fromGradeTo = "Оценка должна быть числом.";
      } else if (gFrom < 0 || gTo > 10) {
        errors.fromGradeTo = "Оценка должна быть в диапазоне 0–10.";
      } else if (gFrom > gTo) {
        errors.fromGradeTo = "Оценка 'От' не может быть больше оценки 'До'.";
      }
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

