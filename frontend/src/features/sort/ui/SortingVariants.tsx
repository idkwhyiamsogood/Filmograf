import type { FC } from "react";

import { SORTING_VARIANTS } from "../model/constants/sortingVariants";

import { RadioGroup } from "@/shared/ui/radio-group";
import { SortingItem } from "./SortingItem";

export const SortingVariants: FC = () => {
  return (
    <RadioGroup defaultValue="default" className="w-fit flex flex-col gap-5">
      {SORTING_VARIANTS.map((variant, idx) => (
        <SortingItem sortingItem={{ ...variant, id: idx }} />
      ))}
    </RadioGroup>
  );
};
