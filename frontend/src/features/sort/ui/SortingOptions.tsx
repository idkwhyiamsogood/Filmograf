import type { FC } from "react";

import { SORTING_OPTIONS } from "../model/constants/sortingOptions";

import { RadioGroup } from "@/shared/ui/radio-group";
import { SortingItem } from "./SortingItem";

export const SortingOptions: FC = () => {
  return (
    <RadioGroup defaultValue="default" className="w-fit flex flex-col gap-5">
      {SORTING_OPTIONS.map((option, idx) => (
        <SortingItem sortingItem={{ ...option, id: idx }} />
      ))}
    </RadioGroup>
  );
};
