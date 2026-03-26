import type { FC } from "react";
import type { SortingItem as SortingItemType } from "../model/types";

import { RadioGroupItem } from "@/shared/ui/radio-group";
import { Label } from "@/shared/ui/label";
import { Check } from "lucide-react";

interface Props {
  sortingItem: SortingItemType;
}

export const SortingItem: FC<Props> = ({ sortingItem }) => {
  const uniqueId = `sort-${sortingItem.type}-${sortingItem.id}`;

  return (
    <div className="relative w-full">
      <RadioGroupItem
        value={sortingItem.value}
        id={uniqueId}
        className="peer sr-only"
      />
      
      <Label
        htmlFor={uniqueId}
        className="
          flex items-center justify-between 
          w-full px-4 py-3 
          rounded-2xl cursor-pointer
          transition-all duration-200
          text-muted-foreground
          hover:bg-muted/40
          active:scale-[0.97]
          
          peer-data-[state=checked]:bg-primary/10 
          peer-data-[state=checked]:text-foreground
          peer-data-[state=checked]:shadow-sm
        "
      >
        <span className="text-base font-medium tracking-wide">
          {sortingItem.label}
        </span>

        <div className="
          flex items-center justify-center 
          text-primary
          opacity-0 scale-50 -rotate-12
          transition-all duration-300 ease-out
          peer-data-[state=checked]:opacity-100 
          peer-data-[state=checked]:scale-100
          peer-data-[state=checked]:rotate-0
        ">
          <Check size={22} strokeWidth={2.5} />
        </div>
      </Label>
    </div>
  );
};