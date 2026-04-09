"use client";

// types
import type { FC } from "react";
import type { ChangeEvent } from "react";

// ui
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/shared/ui/input";

// hooks
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";

interface Props {
  onSearch: (value: string) => void;
}

export const Search: FC<Props> = ({ onSearch }) => {
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

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <div className="relative flex items-center">
      <SearchIcon size={16} className="absolute left-2.5 text-[#8a8a8e]" />

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
  );
};
