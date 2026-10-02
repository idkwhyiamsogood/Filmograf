import { memo, useEffect, type FC } from "react";

import type { EntityType, SearchTypeCollection, SearchTypeMovie } from "@/shared/types";
import { useRouter, useSearchParams } from "@/shared/lib/router-compat";
import { cn } from "@/shared/lib/utils";
import { Tabs } from "@/shared/ui/tabs";
import { useAuth } from "@/shared/hooks";

import { useGenres } from "@/entities/genres";
import { useFilter, useGenresFilter } from "@/features/filter";

import { CollectionContent } from "./TabsContent/CollectionContent";
import { MovieContent } from "./TabsContent/MovieContent";
import { useCatalog } from "../model/hooks/useCatalog";

const MOVIE_SOURCES: { value: SearchTypeMovie; label: string }[] = [
  { value: "top", label: "Топ" },
  { value: "popular", label: "Популярное" },
  { value: "recommended", label: "Для вас" },
];

const COLLECTION_SOURCES: { value: SearchTypeCollection; label: string; member?: boolean }[] = [
  { value: "popular", label: "Популярные" },
  { value: "recommended", label: "Для вас", member: true },
  { value: "my", label: "Мои", member: true },
];

const Chip: FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active,
  onClick,
  children,
}) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={cn(
      "press shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
      active
        ? "bg-foreground text-background"
        : "bg-muted text-muted-foreground hover:text-foreground",
    )}
  >
    {children}
  </button>
);

export const CatalogTabs: FC = memo(() => {
  const { setActiveType, query, hasActiveFilters } = useCatalog();
  const { isGuest } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const { data: genres } = useGenres();
  const { filterState, updateFilterOption, globalReset } = useFilter();
  const { toggleGenre } = useGenresFilter();

  // Вкладка и источник живут в URL: ссылки «Все →» с главной открывают нужный
  // раздел, а «назад» возвращает на тот же.
  const currentTab: EntityType = params.get("type") === "Collection" ? "Collection" : "Movie";
  const source = params.get("searchType");

  useEffect(() => {
    setActiveType(currentTab);
  }, [currentTab, setActiveType]);

  // ?genres=<id> — переход по жанру из карточки фильма.
  useEffect(() => {
    const genre = params.get("genres");
    if (genre) toggleGenre(genre);
  }, []);

  const navigate = (type: EntityType, searchType?: string) =>
    router.replace(`/catalog?type=${type}${searchType ? `&searchType=${searchType}` : ""}`);

  const included = filterState.filterOptions.genres?.include ?? [];
  const setGenre = (id: string) =>
    updateFilterOption("genres", (prev) => {
      const include = prev?.include ?? [];
      return {
        exclude: prev?.exclude ?? [],
        include: include.includes(id) ? include.filter((g) => g !== id) : [...include, id],
      };
    });

  const isSearchMode = query.trim() !== "" || hasActiveFilters;
  const movieSource = (source as SearchTypeMovie) || "top";
  const collectionSource = (source as SearchTypeCollection) || "popular";

  return (
    <Tabs value={currentTab} className="gap-4">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1" role="tablist">
        {(["Movie", "Collection"] as const).map((type) => (
          <button
            key={type}
            type="button"
            role="tab"
            aria-selected={currentTab === type}
            onClick={() => navigate(type)}
            className={cn(
              "rounded-lg py-2 text-sm font-bold transition-all",
              currentTab === type ? "bg-card shadow-sm" : "text-muted-foreground",
            )}
          >
            {type === "Movie" ? "Фильмы" : "Подборки"}
          </button>
        ))}
      </div>

      {isSearchMode && hasActiveFilters && (
        <div className="flex">
          <Chip
            active={false}
            onClick={() => {
              globalReset();
              updateFilterOption("targetType", () => currentTab);
            }}
          >
            ✕ Сбросить фильтры
          </Chip>
        </div>
      )}

      {!isSearchMode && (
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {currentTab === "Movie"
            ? MOVIE_SOURCES.map((s) => (
                <Chip
                  key={s.value}
                  active={movieSource === s.value}
                  onClick={() => navigate("Movie", s.value)}
                >
                  {s.label}
                </Chip>
              ))
            : COLLECTION_SOURCES.filter((s) => !(s.member && isGuest)).map((s) => (
                <Chip
                  key={s.value}
                  active={collectionSource === s.value}
                  onClick={() => navigate("Collection", s.value)}
                >
                  {s.label}
                </Chip>
              ))}
        </div>
      )}

      {/* Быстрый выбор жанра — тот же фильтр, что и в шторке фильтров */}
      {genres.length > 0 && (
        <div className="no-scrollbar -mx-4 -mt-1 flex gap-2 overflow-x-auto px-4">
          {genres.map((g) => {
            const active = included.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                aria-pressed={active}
                onClick={() => setGenre(g.id)}
                className={cn(
                  "press shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground",
                )}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      )}

      {currentTab === "Movie" ? (
        <MovieContent type={movieSource} />
      ) : (
        <CollectionContent type={collectionSource} />
      )}
    </Tabs>
  );
});

CatalogTabs.displayName = "CatalogTabs";
