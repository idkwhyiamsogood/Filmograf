"use client";

// types
import type { FC, ChangeEvent } from "react";

// ui
import { SortingButton } from "@/features/sort";
import { FilterButton } from "@/features/filter";
import { Input } from "@/shared/ui/input";
import { Search } from "lucide-react";

// hooks
import useDebounce from "react-use/esm/useDebounce";
import { useState, useEffect } from "react";
import { useFilter } from "@/features/filter";

export const ActionsWrapper: FC = () => {
  const { filterState } = useFilter();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm],
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {}, [debouncedSearchTerm]);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex gap-2.5">
        <FilterButton />
        <SortingButton />
      </div>

      <div className="relative flex items-center">
        <Search size={16} className="absolute left-2.5 text-[#8a8a8e]" />

        <Input
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Поиск по названию"
          className="
            w-full h-7.5 pl-8 pr-2 py-[2px] 
            text-[13px] leading-[20px] text-accent-foreground
            bg-[#ffffff] border-1 rounded-[5px]
            placeholder:text-[#8a8a8e]"
        />
      </div>
    </div>
  );
};
