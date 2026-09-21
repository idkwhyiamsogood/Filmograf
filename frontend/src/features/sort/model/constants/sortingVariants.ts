import type { NewSortingItem } from "../types";

export const SORTING_VARIANTS: NewSortingItem[] = [
  {
    type: "variant",
    label: "По возрастанию",
    value: "default",
  },
  {
    type: "variant",
    label: "По убыванию",
    value: "descending",
  },
];
