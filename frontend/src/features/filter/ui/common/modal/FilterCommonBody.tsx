import React from "react";

import { CommonCheckboxField } from "@/shared/components";
import { WrapperSheetContent } from "@/shared/components/";
import { ScrollArea } from "@/shared/ui/scroll-area";

import type { Genre } from "@/entities/genres";

interface Props {
  items: Genre[];
  handleToggleItem: (id: string) => void;
  getStatus: (id: string) => {
    checked: boolean;
    indeterminate: boolean;
  };
}

export const FilterCommonBody: React.FC<Props> = ({
  items,
  handleToggleItem,
  getStatus,
}) => {
  return (
    <ScrollArea className="h-[calc(100vh-140px)] mt-12.5 mb-25 mx-0"> 
      <div className="flex flex-col gap-2.5"> 
        {items.map((item) => {
          const status = getStatus(item.id);

          return (
            <WrapperSheetContent key={item.id}>
              <CommonCheckboxField
                label={item.name}
                handleToggle={() => handleToggleItem(item.id)}
                checked={status.checked}
                indeterminate={status.indeterminate}
              />
            </WrapperSheetContent>
          );
        })}
      </div>
    </ScrollArea>
  );
};