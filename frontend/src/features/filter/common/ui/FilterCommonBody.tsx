import React from "react";

import { CommonCheckboxField } from "@/shared/components";
import { WrapperSheetContent } from "@/shared/components/";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { CommonSearchDebounced } from "@/shared/components/";

import type { GenreType } from "@/entities/genres";

interface Props {
  items: GenreType[];
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
    <div className="h-[calc(100vh-180px)] mt-24 mx-0">
      <ScrollArea className="h-full">
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
    </div>
  );
};
