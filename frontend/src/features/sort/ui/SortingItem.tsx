import type { FC } from "react";
import type { SortingItem as SortingItemType } from "../model/types";

import { RadioGroupItem } from "@/shared/ui/radio-group";
import { Label } from "@/shared/ui/label";

interface Props {
  sortingItem: SortingItemType;
}

export const SortingItem: FC<Props> = ({ sortingItem }) => {
  return (
    <div
      className="flex items-center gap-3"
      key={`sort-${sortingItem.type}-${sortingItem.id}`}
    >
      <RadioGroupItem
        value={sortingItem.value}
        id={`sort-${sortingItem.type}-${sortingItem.id}`}
      />
      <Label htmlFor={`sort-${sortingItem.type}-${sortingItem.id}`}>
        {sortingItem.label}
      </Label>
    </div>
  );
};
