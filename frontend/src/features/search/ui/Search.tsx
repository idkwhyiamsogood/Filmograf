import { useEffect, useRef, useState, type FC } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useDebounce } from "react-use";

import { cn } from "@/shared/lib/utils";

interface Props {
  onSearch: (value: string) => void;
  /** Начальное значение — чтобы поиск переживал уход на карточку фильма и обратно */
  defaultValue?: string;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
}

export const Search: FC<Props> = ({
  onSearch,
  defaultValue = "",
  autoFocus,
  placeholder = "Фильм или подборка",
  className,
}) => {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useDebounce(() => onSearch(value), 400, [value]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <label
      className={cn(
        "flex h-11 flex-1 items-center gap-2.5 rounded-xl bg-muted px-3.5 ring-primary/50 transition-shadow focus-within:ring-2",
        className,
      )}
    >
      <SearchIcon className="size-[18px] shrink-0 text-muted-foreground" />
      <input
        ref={inputRef}
        type="search"
        enterKeyHint="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Очистить поиск"
          onClick={() => {
            setValue("");
            onSearch("");
            inputRef.current?.focus();
          }}
          className="flex size-6 items-center justify-center rounded-full bg-muted-foreground/20 text-muted-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </label>
  );
};
