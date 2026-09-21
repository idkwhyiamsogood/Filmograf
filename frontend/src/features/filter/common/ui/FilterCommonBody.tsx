import React, { Ref } from "react";

import { CommonCheckboxField } from "@/shared/components";
import { WrapperSheetContent } from "@/shared/components/";
import { ScrollArea } from "@/shared/ui/scroll-area";

export interface FilterItem {
  id: string;
  name: string;
}

interface Props {
  items: FilterItem[];
  handleToggleItem: (id: string) => void;
  getStatus: (id: string) => {
    checked: boolean;
    indeterminate: boolean;
  };
  ref?: Ref<HTMLDivElement>;
}

export const FilterCommonBody: React.FC<Props> = ({
  items,
  handleToggleItem,
  getStatus,
  ref,
}) => {
  return (
    <div className="h-[calc(100vh-180px)] mt-24 mx-0">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-2.5">
          {!items.length && (
            <div className="flex items-center px-3 w-full justify-center text-justify text-pretty">
              К сожалению по вашему запросу ничего не найдено
            </div>
          )}

          {items.map((item, idx) => {
            const status = getStatus(item.id);

            return (
              <div
                key={item.id}
                ref={ref && items.length === idx + 1 ? ref : undefined}
              >
                <WrapperSheetContent>
                  <CommonCheckboxField
                    label={item.name}
                    handleToggle={() => handleToggleItem(item.id)}
                    checked={status.checked}
                    indeterminate={status.indeterminate}
                  />
                </WrapperSheetContent>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
