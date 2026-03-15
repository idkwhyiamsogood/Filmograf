import React from "react";

import { CommonCheckboxField } from "@/shared/components";
import { WrapperSheetContent } from "@/shared/components/";

import type { FilterItem } from "@/features/filter/model/types/types";

interface Props {
  items: FilterItem[];
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
    <div className="flex flex-col gap-2.5 my-16">
      {items.map((item) => {
        const status = getStatus(item.id);

        return (
          <WrapperSheetContent key={item.id}>
            <CommonCheckboxField
              label={item.label}
              handleToggle={() => handleToggleItem(item.id)}
              checked={status.checked}
              indeterminate={status.indeterminate}
            />
          </WrapperSheetContent>
        );
      })}
    </div>
  );
};
