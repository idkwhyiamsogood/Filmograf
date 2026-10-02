import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LogIn, Star } from "lucide-react";

import { MovieSkeletonWrapper, MovieWrapper, useMovie, useMyRates } from "@/entities/movie";
import { useUser } from "@/entities/user";
import { CommonWrapper, EmptyState, PageHeader, QueryErrorState } from "@/shared/components";
import { useModals } from "@/shared/contexts/modal-context";
import { pluralize } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import Link from "@/shared/ui/link";

export const Route = createFileRoute("/rates")({
  component: RatesPage,
});

type Sort = "recent" | "high" | "low";

const SORTS: { value: Sort; label: string }[] = [
  { value: "recent", label: "Недавние" },
  { value: "high", label: "Высокие" },
  { value: "low", label: "Низкие" },
];

function RatesPage() {
  const { isGuest } = useUser();
  const { openModal } = useModals();
  const [sort, setSort] = useState<Sort>("recent");

  const { data: rates, isLoading, isError, error, refetch } = useMyRates();

  const sorted = useMemo(() => {
    const list = [...(rates ?? [])];
    if (sort === "recent") list.sort((a, b) => String(b.updateDate).localeCompare(String(a.updateDate)));
    if (sort === "high") list.sort((a, b) => b.rate - a.rate);
    if (sort === "low") list.sort((a, b) => a.rate - b.rate);
    return list;
  }, [rates, sort]);

  const ids = sorted.map((r) => r.movieId);
  const rateMap = Object.fromEntries(sorted.map((r) => [r.movieId, r.rate]));
  const { data: movies, isLoading: isMoviesLoading } = useMovie(ids, { enabled: ids.length > 0 });

  // useMovie сортирует ключ — восстанавливаем порядок выбранной сортировки.
  const ordered = ids
    .map((id) => movies?.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const avg = rates?.length
    ? (rates.reduce((s, r) => s + r.rate, 0) / rates.length).toFixed(1)
    : null;

  const body = () => {
    if (isGuest) {
      return (
        <EmptyState
          icon={Star}
          title="Оценки сохраняются в аккаунте"
          description="Войдите, чтобы оценивать фильмы и получать рекомендации по вкусу."
          action={
            <Button
              className="h-11 rounded-xl px-5 font-bold"
              onClick={() => openModal("authorization-menu", { reason: "оценивать фильмы" })}
            >
              <LogIn className="size-4" /> Войти
            </Button>
          }
        />
      );
    }
    if (isError) return <QueryErrorState error={error} onRetry={() => refetch()} />;
    if (isLoading || (ids.length > 0 && isMoviesLoading)) return <MovieSkeletonWrapper count={9} />;
    if (!ids.length) {
      return (
        <EmptyState
          icon={Star}
          title="Вы ещё ничего не оценили"
          description="Ставьте оценки фильмам — так рекомендации станут точнее."
          action={
            <Button asChild className="h-11 rounded-xl px-5 font-bold">
              <Link href="/top">Открыть топ фильмов</Link>
            </Button>
          }
        />
      );
    }

    return (
      <>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {SORTS.map((s) => (
            <button
              key={s.value}
              type="button"
              aria-pressed={sort === s.value}
              onClick={() => setSort(s.value)}
              className={cn(
                "press shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold",
                sort === s.value ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <MovieWrapper movies={ordered} userRates={rateMap} />
      </>
    );
  };

  return (
    <CommonWrapper className="gap-4">
      <PageHeader
        back
        title="Мои оценки"
        subtitle={
          rates?.length
            ? `${pluralize(rates.length, ["фильм", "фильма", "фильмов"])} · средняя ${avg}`
            : undefined
        }
      />
      {body()}
    </CommonWrapper>
  );
}
