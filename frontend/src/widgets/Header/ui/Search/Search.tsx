// types
import type { FC } from "react";

// components
import { Input } from "@/shared/ui/input";
import { Search as SearchLogo } from "lucide-react";
import { SearchItem } from "./SearchItem";

// hooks
import { useRef, useState } from "react";
import { useClickAway, useDebounce } from "react-use";

// fn
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { usePathname } from "@/shared/lib/router-compat";

export const Search: FC = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [curPage, setCurPage] = useState<number>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  useClickAway(containerRef, () => {
    setIsDropdownOpen(false);
  });

  const handleButton = () => {
    console.log(curPage);
    setCurPage((prevPage) => prevPage + 1);
    console.log(curPage);

    handleSearch(query).then(addData);
  };

  const addData = (addData: any[]) => {
    setData((prevData) => [...prevData, ...addData]);
  };

  const handleSearch = (query: string) => {
    // Заглушка
    return {} as any;
  };

  useDebounce(
    () => {
      handleSearch(query).then(setData);
    },
    300,
    [query],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleItemClick = () => {
    setIsDropdownOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef}>
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
        <SearchLogo className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent/80" />
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 z-50 max-h-80 overflow-y-auto">
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
