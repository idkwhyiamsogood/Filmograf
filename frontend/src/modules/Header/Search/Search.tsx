"use client";

// types
import type { FC } from "react";

// components
import { Input } from "@/ui/input";
import { Search as SearchLogo } from "lucide-react";
import { SearchItem } from "./SearchItem";
import { toastMessage } from "@/components/toast";

// hooks
import { useDebounce, useClickAway } from "react-use";
import { useCallback, useState, useRef, useEffect } from "react";

// fn
import { cn } from "@/shared/lib/utils";
import { FilmService } from "services";
import { Button } from "@/ui/button";

interface Props {
  className?: string | undefined;
}

export const Search: FC<Props> = ({ className }) => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [curPage, setCurPage] = useState<number>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickAway(containerRef, () => {
    setIsDropdownOpen(false);
  });

  const handleButton = () => {
    console.log(curPage);
    setCurPage((prevPage) => prevPage + 1);
    console.log(curPage);

    handleSearch(query).then(addData);
  };

  const handleSearch = async (searchTerm: string) => {
    const trimmedQuery = searchTerm.trim();

    if (trimmedQuery) {
      setIsLoading(true);
      const data = await FilmService.fetchFilmByTitle(trimmedQuery, curPage);
      setIsDropdownOpen(true);

      setIsLoading(false);
      return data.docs || [];
    } else {
      setIsDropdownOpen(false);
      setIsLoading(false);
      setData([]);
    }
  };

  const addData = (addData: any[]) => {
    setData((prevData) => [...prevData, ...addData]);
  };

  useDebounce(
    () => {
      handleSearch(query).then(setData);
    },
    300,
    [query]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleItemClick = () => {
    setIsDropdownOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className={cn(className, "relative")}>
      <div className="relative">
        <Input
          value={query}
          onChange={handleChange}
          onFocus={() => data && setIsDropdownOpen(true)}
          className="border-none bg-accent-foreground 
          placeholder:text-lg! placeholder:text-accent/70
          text-lg! text-accent/70"
          placeholder="Введите название фильма"
        />
        <SearchLogo className="absolute right-5 top-1/2 transform -translate-y-1/2 text-accent/70" />
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Загрузка...</div>
          ) : data.length > 0 ? (
            <div className="flex flex-col">
              {data.map((item, index) => (
                <div
                  key={item.id || index}
                  className="border-b border-gray-100 last:border-b-0"
                  onClick={handleItemClick}
                >
                  <SearchItem data={item} />
                </div>
              ))}
              <Button className="mx-25 my-2.5" onClick={handleButton}>
                Загрузить еще
              </Button>
            </div>
          ) : (
            query.trim() && (
              <div className="p-4 text-center text-gray-500">
                Ничего не найдено
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
