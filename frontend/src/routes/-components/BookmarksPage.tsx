import { useState, type FC } from "react";
import { Bookmark, FolderPlus, LogIn, Pin, Plus } from "lucide-react";

import {
  CollectionCover,
  useCollections,
  useInfiniteCollections,
} from "@/entities/collection";
import { useCollectionPins } from "@/entities/collection-pins";
import { useUser } from "@/entities/user";
import { CommonWrapper, EmptyState, PageHeader, QueryErrorState } from "@/shared/components";
import { useModals } from "@/shared/contexts/modal-context";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import Link from "@/shared/ui/link";

type Tab = "my" | "pinned";

const Grid: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>
);

const GridSkeleton = () => (
  <Grid>
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="aspect-[4/5] w-full rounded-2xl" />
    ))}
  </Grid>
);

const MyCollections: FC = () => {
  const { openModal } = useModals();
  const { collections, isLoading, isError, error, refetch } = useInfiniteCollections({
    type: "my",
    pageSize: 100,
  });

  if (isLoading) return <GridSkeleton />;
  if (isError) return <QueryErrorState error={error} onRetry={() => refetch()} />;

  if (!collections.length) {
    return (
      <EmptyState
        icon={FolderPlus}
        title="Соберите первую подборку"
        description="«На выходные», «С друзьями», «Пересмотреть» — сохраняйте фильмы так, как удобно вам."
        action={
          <Button className="h-11 rounded-xl px-5 font-bold" onClick={() => openModal("create-bookmark")}>
            <Plus className="size-4" />
            Создать подборку
          </Button>
        }
      />
    );
  }

  return (
    <Grid>
      {collections.map((c) => (
        <CollectionCover key={c.id} collection={c} />
      ))}
      {/* Повторяет раскладку CollectionCover (обложка 5:4 + две строки
          подписи), поэтому всегда одной высоты с карточками. Пунктир —
          outline, а не border, чтобы не добавлять к размеру. */}
      <button
        type="button"
        onClick={() => openModal("create-bookmark")}
        className="press group block rounded-2xl text-left text-muted-foreground outline-2 -outline-offset-2 outline-border outline-dashed transition-colors select-none hover:text-primary hover:outline-primary"
      >
        <div className="flex aspect-[5/4] items-center justify-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-brand-soft">
            <Plus className="size-6" />
          </span>
        </div>
        <div className="flex flex-col gap-0.5 px-3 pt-1 pb-3">
          <span className="line-clamp-1 text-[13px] leading-tight font-bold text-foreground">Новая подборка</span>
          <span className="text-[11px]">Создать свою</span>
        </div>
      </button>
    </Grid>
  );
};

const PinnedCollections: FC = () => {
  const { data: pins, isLoading: isPinsLoading } = useCollectionPins();
  const { data: collections, isLoading } = useCollections(pins, { enabled: pins.length > 0 });

  if (isPinsLoading || (pins.length > 0 && isLoading)) return <GridSkeleton />;

  if (!pins.length || !collections?.length) {
    return (
      <EmptyState
        icon={Pin}
        title="Нет закреплённых подборок"
        description="Понравилась чужая подборка? Закрепите её — она появится здесь."
        action={
          <Button asChild variant="secondary" className="h-11 rounded-xl px-5 font-bold">
            <Link href="/catalog?type=Collection">Смотреть подборки</Link>
          </Button>
        }
      />
    );
  }

  return (
    <Grid>
      {collections.map((c) => (
        <CollectionCover key={c.id} collection={c} />
      ))}
    </Grid>
  );
};

export const BookmarksPage: FC<{ initialTab?: Tab }> = ({ initialTab = "my" }) => {
  const { isGuest } = useUser();
  const { openModal } = useModals();
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <CommonWrapper className="gap-4">
      <PageHeader
        title="Закладки"
        actions={
          !isGuest && (
            <Button
              size="icon"
              aria-label="Новая подборка"
              className="size-10 rounded-full"
              onClick={() => openModal("create-bookmark")}
            >
              <Plus className="size-5" />
            </Button>
          )
        }
      />

      {isGuest ? (
        <EmptyState
          icon={Bookmark}
          title="Сохраняйте фильмы в подборки"
          description="Войдите, чтобы собирать свои подборки и закреплять чужие."
          action={
            <Button
              className="h-11 rounded-xl px-5 font-bold"
              onClick={() => openModal("authorization-menu", { reason: "собирать подборки" })}
            >
              <LogIn className="size-4" />
              Войти
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1" role="tablist">
            {(
              [
                ["my", "Мои подборки"],
                ["pinned", "Избранные"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={cn(
                  "rounded-lg py-2 text-sm font-bold transition-all",
                  tab === value ? "bg-card shadow-sm" : "text-muted-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {tab === "my" ? <MyCollections /> : <PinnedCollections />}
        </>
      )}
    </CommonWrapper>
  );
};
