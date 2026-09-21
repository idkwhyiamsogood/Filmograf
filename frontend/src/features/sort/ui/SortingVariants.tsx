import type { FC } from "react";
import { SORTING_VARIANTS } from "../model/constants/sortingVariants";
import { RadioGroup } from "@/shared/ui/radio-group";
import { SortingItem } from "./SortingItem";

export const SortingVariants: FC = () => {
  return (
    <RadioGroup defaultValue="default" className="w-full flex flex-col gap-1">
      {SORTING_VARIANTS.map((variant, idx) => (
        <SortingItem key={idx} sortingItem={{ ...variant, id: idx }} />
      ))}
    </RadioGroup>
  );
};