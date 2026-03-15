import type { NewSortingItem } from "../types";

export const SORTING_OPTIONS: NewSortingItem[] = [
  {
    type: "option",
    label: "По популярности",
    value: "default",
  },
  {
    type: "option",
    label: "По релевантности",
    value: "relevance",
  },
  {
    type: "option",
    label: "По рейтингу",
    value: "rating",
  },
  {
    type: "option",
    label: "По просмотрам",
    value: "views",
  },
  {
    type: "option",
    label: "По дата релиза",
    value: "realeaseDate",
  },
];
