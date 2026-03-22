import React, { ReactNode } from "react";

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty
} from "@/shared/ui/command";

interface Props {
  onChangeValue: (value: string) => void;
  items: SearchItem[];
  commandEmpty: ReactNode;
}

export interface SearchItem {
  id: string;
  name: string;
}

export const CommonSearchSelector: React.FC<Props> = ({
  onChangeValue,
  items,
  commandEmpty,
}) => {
  return (
    <Command>
      <CommandInput
        placeholder="Начните вводить тег..."
        onValueChange={onChangeValue}
      />
      <CommandList>
        {items.map((item) => (
          <CommandItem>{item.name}</CommandItem>
        ))}
        <CommandEmpty>{commandEmpty}</CommandEmpty>
      </CommandList>
    </Command>
  );
};
