"use client";

import React, { ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/shared/ui/command";
import { Checkbox } from "@/shared/ui/checkbox";
import { LoadingSplashScreen } from "../fallback/LoadingSplashScreen";

export interface SearchItem {
  id: string;
  name: string;
}

interface Props {
  onChangeValue: (value: string) => void;
  items: SearchItem[];
  commandEmpty: ReactNode;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isLoading?: boolean;
}

export const CommonSearchSelector: React.FC<Props> = ({
  onChangeValue,
  items,
  commandEmpty,
  onLoadMore,
  hasNextPage,
  isLoading,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isLoading && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasNextPage, isLoading, onLoadMore]);

  return (
    <Command className="border rounded-lg">
      <CommandInput
        placeholder="Начните вводить тег..."
        onValueChange={onChangeValue}
      />
      <CommandList className="max-h-[200px] h-50 overflow-y-auto">
        {items.map((item) => (
          <CommandItem key={item.id} value={item.name} className="flex gap-2.5">
            <Checkbox onClick={() => console.log(item)} />
            {item.name}
          </CommandItem>
        ))}

        {isLoading && (
          <div className="h-full flex items-center">
            <LoadingSplashScreen />
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <CommandEmpty onClick={(e) => e.preventDefault()}>
            {commandEmpty}
          </CommandEmpty>
        )}

        {hasNextPage && (
          <div
            ref={ref}
            className="flex items-center justify-center p-4 w-full"
          >
            <div className="h-4" />
          </div>
        )}
      </CommandList>
    </Command>
  );
};
