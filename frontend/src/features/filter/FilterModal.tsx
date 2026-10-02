import { useEffect, useMemo, useState, type FC, type ReactNode } from "react";
import { Check, ChevronRight, Minus, Search, X } from "lucide-react";
import { useDebounce } from "react-use";

import { useGenres } from "@/entities/genres";
import { useInfinityTags, useTagsSearch } from "@/entities/collection-tags";
import { useModals } from "@/shared/contexts/modal-context";
import type { BaseModalProps } from "@/shared/contexts/modal-context/modals.type";
import { cn } from "@/shared/lib/utils";
import { BottomSheet, SheetGroup, SheetOptionRow } from "@/shared/ui/bottom-sheet";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { Switch } from "@/shared/ui/switch";

import { useFilter } from "./common";
import type { FilterState } from "./common/model/types/types";
import { validateFilters } from "./common/model/lib/validateFilters";

type Page = "main" | "genres" | "tags";
type TriQuery = { include: string[]; exclude: string[] };

const AGES = [0, 6, 12, 16, 18];
const GRADES = [6, 7, 8, 9];
const YEAR = new Date().getFullYear();
const DECADES: { label: string; range: [string, string] }[] = [
  { label: "2020-е", range: ["2020", String(YEAR)] },
  { label: "2010-е", range: ["2010", "2019"] },
  { label: "2000-е", range: ["2000", "2009"] },
  { label: "90-е", range: ["1990", "1999"] },
  { label: "Классика", range: ["1900", "1989"] },
];

const empty = (): TriQuery => ({ include: [], exclude: [] });

/** Нажатие по пункту: не выбран → включить → исключить → не выбран. */
const cycle = (q: TriQuery | undefined, id: string): TriQuery => {
  const { include, exclude } = q ?? empty();
  if (include.includes(id)) return { include: include.filter((i) => i !== id), exclude: [...exclude, id] };
  if (exclude.includes(id)) return { include, exclude: exclude.filter((i) => i !== id) };
  return { include: [...include, id], exclude };
};

const Chip: FC<{ active: boolean; onClick: () => void; children: ReactNode }> = ({ active, onClick, children }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={cn(
      "press rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors",
      active ? "bg-foreground text-background" : "bg-muted text-foreground",
    )}
  >
    {children}
  </button>
);

const TriRow: FC<{ name: string; state: "include" | "exclude" | null; onClick: () => void }> = ({
  name,
  state,
  onClick,
}) => (
  <button type="button" onClick={onClick} className="press flex w-full items-center gap-3 px-4 py-3 text-left">
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
        state === "include" && "border-primary bg-primary text-primary-foreground",
        state === "exclude" && "border-destructive bg-destructive text-white",
        !state && "border-muted-foreground/40",
      )}
    >
      {state === "include" && <Check className="size-4" strokeWidth={3} />}
      {state === "exclude" && <Minus className="size-4" strokeWidth={3} />}
    </span>
    <span className={cn("flex-1 text-[15px] font-medium", state === "exclude" && "text-muted-foreground line-through")}>
      {name}
    </span>
  </button>
);

const ListSearch: FC<{ value: string; onChange: (v: string) => void; placeholder: string }> = ({
  value,
  onChange,
  placeholder,
}) => (
  <label className="sticky top-0 z-10 mb-3 flex h-11 items-center gap-2.5 rounded-xl bg-muted px-3.5 ring-primary/50 focus-within:ring-2">
    <Search className="size-4 text-muted-foreground" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
    />
    {value && (
      <button type="button" aria-label="Очистить" onClick={() => onChange("")}>
        <X className="size-4 text-muted-foreground" />
      </button>
    )}
  </label>
);

const triState = (q: TriQuery | undefined, id: string) =>
  q?.include.includes(id) ? "include" : q?.exclude.includes(id) ? "exclude" : null;

const Legend = () => (
  <p className="mb-3 px-1 text-xs text-muted-foreground">
    Нажмите раз — показывать, ещё раз — исключить, третий — снять.
  </p>
);

const GenresPage: FC<{ value?: TriQuery; onChange: (q: TriQuery) => void }> = ({ value, onChange }) => {
  const { data: genres, isLoading } = useGenres();
  const [query, setQuery] = useState("");
  const list = genres.filter((g) => g.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <>
      <ListSearch value={query} onChange={setQuery} placeholder="Найти жанр" />
      <Legend />
      <div className="divide-y overflow-hidden rounded-2xl bg-muted/50">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="m-3 h-6 w-1/2" />)}
        {list.map((g) => (
          <TriRow key={g.id} name={g.name} state={triState(value, g.id)} onClick={() => onChange(cycle(value, g.id))} />
        ))}
        {!isLoading && !list.length && <p className="p-4 text-sm text-muted-foreground">Жанр не найден</p>}
      </div>
    </>
  );
};

const TagsPage: FC<{ value?: TriQuery; onChange: (q: TriQuery) => void }> = ({ value, onChange }) => {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  useDebounce(() => setDebounced(query.trim()), 250, [query]);

  const { tags, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfinityTags({ pageSize: 30 });
  const { data: found = [], isLoading: isSearching } = useTagsSearch(debounced);
  const list = debounced ? found : tags;

  return (
    <>
      <ListSearch value={query} onChange={setQuery} placeholder="Найти тег" />
      <Legend />
      <div className="divide-y overflow-hidden rounded-2xl bg-muted/50">
        {(isLoading || (debounced && isSearching)) &&
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="m-3 h-6 w-1/2" />)}
        {list.map((t) => (
          <TriRow key={t.id} name={`#${t.name}`} state={triState(value, t.id)} onClick={() => onChange(cycle(value, t.id))} />
        ))}
        {!isLoading && !isSearching && !list.length && <p className="p-4 text-sm text-muted-foreground">Ничего не нашлось</p>}
      </div>
      {!debounced && hasNextPage && (
        <Button variant="ghost" className="mt-2 w-full" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
          Показать ещё
        </Button>
      )}
    </>
  );
};

const NavRow: FC<{ title: string; value: string; onClick: () => void; disabled?: boolean }> = ({
  title,
  value,
  onClick,
  disabled,
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className="press flex w-full items-center gap-3 px-4 py-3.5 text-left disabled:opacity-45"
  >
    <span className="flex-1 text-[15px] font-semibold">{title}</span>
    <span className="max-w-[55%] truncate text-sm text-muted-foreground">{value}</span>
    <ChevronRight className="size-4 text-muted-foreground" />
  </button>
);

const YearInput: FC<{ value: string; onChange: (v: string) => void; placeholder: string }> = (p) => (
  <input
    inputMode="numeric"
    maxLength={4}
    value={p.value}
    placeholder={p.placeholder}
    onChange={(e) => p.onChange(e.target.value.replace(/\D/g, ""))}
    className="h-11 w-full min-w-0 rounded-xl bg-muted px-3.5 text-center text-[15px] font-semibold tabular-nums outline-none ring-primary/50 placeholder:font-normal placeholder:text-muted-foreground focus:ring-2"
  />
);

export const FilterModal: FC<BaseModalProps> = ({ isOpen }) => {
  const { closeModal } = useModals();
  const { filterState, setFilters } = useFilter();
  const { data: genres } = useGenres();

  // Черновик: правим локально, применяем кнопкой — без запросов на каждый тап.
  const [draft, setDraft] = useState<FilterState>(filterState);
  const [page, setPage] = useState<Page>("main");

  useEffect(() => {
    if (isOpen) {
      setDraft(filterState);
      setPage("main");
    }
  }, [isOpen]);

  const fo = draft.filterOptions;
  const isMovie = fo.targetType === "Movie";
  const set = (patch: Partial<FilterState["filterOptions"]>) =>
    setDraft((d) => ({ ...d, filterOptions: { ...d.filterOptions, ...patch } }));

  const validation = validateFilters(draft);
  const close = () => closeModal("search-filter");

  const genresSummary = useMemo(() => {
    const inc = (fo.genres?.include ?? []).map((id) => genres.find((g) => g.id === id)?.name).filter(Boolean);
    const exc = fo.genres?.exclude?.length ?? 0;
    if (!inc.length && !exc) return "Любые";
    return [inc.join(", "), exc ? `без ${exc}` : ""].filter(Boolean).join(" · ");
  }, [fo.genres, genres]);

  const tagsCount = (fo.tags?.include?.length ?? 0) + (fo.tags?.exclude?.length ?? 0);
  const [yFrom = "", yTo = ""] = fo.fromYearTo ?? [];
  const minGrade = fo.fromGradeTo?.[0];

  const reset = () =>
    setDraft({ strictMatch: false, filterOptions: { targetType: fo.targetType } });

  const apply = () => {
    if (!validation.isValid) return;
    setFilters(draft);
    close();
  };

  const titles: Record<Page, string> = { main: "Фильтры", genres: "Жанры", tags: "Теги" };

  return (
    <BottomSheet
      open={isOpen}
      onOpenChange={(open) => !open && close()}
      size="tall"
      title={titles[page]}
      onBack={page !== "main" ? () => setPage("main") : undefined}
      headerAction={
        page === "main" ? (
          <Button variant="ghost" size="sm" className="font-semibold text-primary" onClick={reset}>
            Сбросить
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="font-semibold text-primary"
            onClick={() => set(page === "genres" ? { genres: empty() } : { tags: empty() })}
          >
            Очистить
          </Button>
        )
      }
      footer={
        page === "main" ? (
          <div className="space-y-2 pb-1">
            {!validation.isValid && (
              <p className="text-center text-xs font-medium text-destructive">
                {validation.errors.fromYearTo ?? validation.errors.fromGradeTo}
              </p>
            )}
            <Button
              className="h-12 w-full rounded-xl text-[15px] font-bold"
              disabled={!validation.isValid}
              onClick={apply}
            >
              Показать {isMovie ? "фильмы" : "подборки"}
            </Button>
          </div>
        ) : (
          <Button className="mb-1 h-12 w-full rounded-xl text-[15px] font-bold" onClick={() => setPage("main")}>
            Готово
          </Button>
        )
      }
    >
      {page === "genres" && <GenresPage value={fo.genres as TriQuery} onChange={(genres) => set({ genres })} />}
      {page === "tags" && <TagsPage value={fo.tags as TriQuery} onChange={(tags) => set({ tags })} />}

      {page === "main" && (
        <div className="flex flex-col gap-6 pt-1">
          <SheetGroup>
            <NavRow title="Жанры" value={genresSummary} onClick={() => setPage("genres")} />
            {!isMovie && (
              <NavRow title="Теги" value={tagsCount ? `Выбрано ${tagsCount}` : "Любые"} onClick={() => setPage("tags")} />
            )}
            <SheetOptionRow
              title="Строгое совпадение"
              description="Только то, где есть все выбранные жанры и теги"
              control={
                <Switch
                  checked={draft.strictMatch}
                  onCheckedChange={(v) => setDraft((d) => ({ ...d, strictMatch: v }))}
                  className="h-7 w-12 shrink-0 [&>span]:size-6"
                />
              }
            />
          </SheetGroup>

          {isMovie && (
            <>
              <section className="space-y-2.5">
                <h3 className="px-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">Год выпуска</h3>
                <div className="flex flex-wrap gap-2">
                  {DECADES.map((d) => {
                    const active = yFrom === d.range[0] && yTo === d.range[1];
                    return (
                      <Chip key={d.label} active={active} onClick={() => set({ fromYearTo: active ? undefined : [...d.range] })}>
                        {d.label}
                      </Chip>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <YearInput value={yFrom} placeholder="с 1980" onChange={(v) => set({ fromYearTo: [v, yTo] })} />
                  <span className="h-px w-4 shrink-0 bg-muted-foreground/40" />
                  <YearInput value={yTo} placeholder={`по ${YEAR}`} onChange={(v) => set({ fromYearTo: [yFrom, v] })} />
                </div>
              </section>

              <section className="space-y-2.5">
                <h3 className="px-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">Рейтинг IMDb</h3>
                <div className="flex flex-wrap gap-2">
                  <Chip active={minGrade == null} onClick={() => set({ fromGradeTo: undefined })}>
                    Любой
                  </Chip>
                  {GRADES.map((g) => (
                    <Chip key={g} active={Number(minGrade) === g} onClick={() => set({ fromGradeTo: [g, 10] })}>
                      ★ {g}+
                    </Chip>
                  ))}
                </div>
              </section>

              <section className="space-y-2.5">
                <h3 className="px-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">Возраст</h3>
                <div className="flex flex-wrap gap-2">
                  {AGES.map((age) => {
                    const active = fo.ageRating?.includes(age) ?? false;
                    return (
                      <Chip
                        key={age}
                        active={active}
                        onClick={() =>
                          set({
                            ageRating: active
                              ? (fo.ageRating ?? []).filter((a) => a !== age)
                              : [...(fo.ageRating ?? []), age],
                          })
                        }
                      >
                        {age}+
                      </Chip>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </BottomSheet>
  );
};
