import React from "react";
import { Check, Plus } from "lucide-react";

import { useInfiniteCollections } from "@/entities/collection";
import { useModals } from "@/shared/contexts/modal-context";
import { pluralize } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Poster } from "@/shared/ui/poster";
import { Skeleton } from "@/shared/ui/skeleton";

import { useMovieToCollection } from "../model/useMovieToCollection";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movieId: string;
}

export const CollectionPickerSheet: React.FC<Props> = ({ open, onOpenChange, movieId }) => {
  const { collections, isLoading } = useInfiniteCollections({ type: "my", pageSize: 100 });
  const { mutate, isPending, variables } = useMovieToCollection();
  const { openModal } = useModals();

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Сохранить в подборку"
      description="Отметьте подборки, в которых должен быть фильм"
    >
      <div className="flex flex-col gap-1 pb-3">
        <button
          type="button"
          onClick={() => {
            onOpenChange(false);
            openModal("create-bookmark");
          }}
          className="press flex items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-accent"
        >
          <span className="flex size-12 items-center justify-center rounded-lg border-2 border-dashed border-primary/50 text-primary">
            <Plus className="size-5" />
          </span>
          <span className="font-semibold text-primary">Новая подборка</span>
        </button>

        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}

        {collections.map((collection) => {
          const has = collection.movies.includes(movieId);
          const pending = isPending && variables?.collectionId === collection.id;

          return (
            <button
              key={collection.id}
              type="button"
              disabled={pending}
              aria-pressed={has}
              onClick={() =>
                mutate({ movieId, collectionId: collection.id, shouldAdd: !has })
              }
              className="press flex items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-accent disabled:opacity-60"
            >
              <div className="w-12 shrink-0">
                <Poster
                  src={collection.moviePreviews[0]}
                  alt={collection.name}
                  ratio="square"
                  rounded="rounded-lg"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{collection.name}</p>
                <p className="text-xs text-muted-foreground">
                  {pluralize(collection.movies.length, ["фильм", "фильма", "фильмов"])}
                </p>
              </div>
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border-2 transition-colors",
                  has ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
                )}
              >
                {has && <Check className="size-4" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
};
