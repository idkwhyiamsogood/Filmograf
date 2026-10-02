import { useState, type FC } from "react";
import {
  BadgeCheck,
  ChevronLeft,
  Copy,
  Film,
  Lock,
  MessageCircleOff,
  MoreHorizontal,
  Pin,
  PinOff,
  Settings2,
  Share2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { type Collection, useCopyCollection, useDeleteCollection } from "@/entities/collection";
import { useCollectionPins, usePinCollection, useUnpinCollection } from "@/entities/collection-pins";
import { useTags } from "@/entities/collection-tags";
import { MovieSkeletonWrapper, MovieWrapper, useMovie } from "@/entities/movie";
import { UserLogo, useRequireMember, useUser, useUserLight } from "@/entities/user";
import { CommentWrapper } from "@/widgets/comments/CommentWrapper";

import { EmptyState } from "@/shared/components";
import { useModals } from "@/shared/contexts/modal-context";
import { pluralize } from "@/shared/lib";
import { useRouter } from "@/shared/lib/router-compat";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Poster } from "@/shared/ui/poster";
import { Skeleton } from "@/shared/ui/skeleton";

interface Props {
  collection: Collection;
}

const FAN = [
  "left-[8%] top-[18%] w-[34%] -rotate-[8deg] brightness-90",
  "right-[8%] top-[18%] w-[34%] rotate-[8deg] brightness-90",
  "left-1/2 top-[4%] z-10 w-[40%] -translate-x-1/2 shadow-2xl",
];

const Author: FC<{ userId: string }> = ({ userId }) => {
  const { data: author, isLoading } = useUserLight(userId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }
  if (!author) return null;

  return (
    <div className="flex items-center gap-2">
      <UserLogo logo={author.avatarUrl} name={author.name} className="size-7" />
      <span className="text-sm font-semibold">{author.name}</span>
    </div>
  );
};

const CollectionMovieGrid: FC<{ ids: string[]; isOwner: boolean }> = ({ ids, isOwner }) => {
  const { data: movies, isLoading } = useMovie(ids, { enabled: ids.length > 0 });

  if (!ids.length) {
    return (
      <EmptyState
        icon={Film}
        title="В подборке пока нет фильмов"
        description={
          isOwner
            ? "Откройте любой фильм и нажмите «В подборку»."
            : "Автор ещё не добавил сюда фильмы."
        }
      />
    );
  }
  if (isLoading || !movies) return <MovieSkeletonWrapper count={Math.min(ids.length, 9)} />;

  return <MovieWrapper movies={movies} />;
};

export const CollectionDetails: FC<Props> = ({ collection }) => {
  const router = useRouter();
  const { user } = useUser();
  const { openModal } = useModals();
  const requireMember = useRequireMember();

  const [tab, setTab] = useState<"movies" | "comments">("movies");

  const { data: tags } = useTags(collection.tags);
  const { data: pins } = useCollectionPins();
  const { mutate: pin, isPending: isPinning } = usePinCollection();
  const { mutate: unpin, isPending: isUnpinning } = useUnpinCollection();
  const { mutate: copy } = useCopyCollection();
  const { mutate: remove } = useDeleteCollection();

  const isOwner = Boolean(user && user.id === collection.userId);
  const isPinned = pins.includes(collection.id);
  const posters = collection.moviePreviews.slice(0, 3);

  const togglePin = () =>
    requireMember("закреплять подборки", () =>
      isPinned ? unpin(collection.id) : pin(collection.id),
    );

  const handleCopy = () =>
    requireMember("копировать подборки", () =>
      copy({
        id: collection.id,
        data: {
          name: `${collection.name} (копия)`.slice(0, 20),
          tags: collection.tags,
          isPublic: collection.isPublic,
          isCommentable: collection.isCommentable,
          isCopiable: collection.isCopiable,
        },
      }),
    );

  const handleDelete = () =>
    openModal("confirmation-menu", {
      title: "Удалить подборку?",
      description: `«${collection.name}» исчезнет навсегда, фильмы останутся в каталоге.`,
      confirmText: "Удалить",
      onConfirm: () =>
        remove(collection.id, { onSuccess: () => router.replace("/collections") }),
    });

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: collection.name, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Ссылка скопирована");
      }
    } catch {
      // отменено пользователем
    }
  };

  return (
    <div className="pb-6 animate-fade-up">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {posters[0] && (
          <img
            src={posters[0]}
            alt=""
            className="absolute inset-0 h-full w-full scale-125 object-cover opacity-40 blur-2xl"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

        <div className="relative flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
          <button
            type="button"
            aria-label="Назад"
            onClick={() => router.back()}
            className="press flex size-10 items-center justify-center rounded-full bg-background/60 backdrop-blur-md"
          >
            <ChevronLeft className="size-6" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Действия с подборкой"
                className="press flex size-10 items-center justify-center rounded-full bg-background/60 backdrop-blur-md"
              >
                <MoreHorizontal className="size-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52 rounded-xl">
              <DropdownMenuItem onClick={share}>
                <Share2 /> Поделиться
              </DropdownMenuItem>
              {isOwner ? (
                <>
                  <DropdownMenuItem onClick={() => openModal("update-bookmark", { collection })}>
                    <Settings2 /> Настроить
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                    <Trash2 /> Удалить подборку
                  </DropdownMenuItem>
                </>
              ) : (
                collection.isCopiable && (
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy /> Скопировать к себе
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="relative mx-auto mt-2 aspect-[16/10] w-full max-w-md">
          {posters.length === 3 ? (
            posters.map((src, i) => (
              <div key={`${src}-${i}`} className={cn("absolute", FAN[i])}>
                <Poster src={src} alt="" rounded="rounded-xl" />
              </div>
            ))
          ) : (
            <div className="absolute top-[4%] left-1/2 w-[40%] -translate-x-1/2 shadow-2xl">
              <Poster src={posters[0]} alt={collection.name} rounded="rounded-xl" />
            </div>
          )}
        </div>
      </div>

      {/* Описание */}
      <div className="flex flex-col gap-3 px-4 pt-3">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="flex items-center gap-1.5 text-2xl leading-tight font-extrabold">
            {collection.name}
            {collection.isByFilmograf && (
              <BadgeCheck className="size-5 shrink-0 text-primary" aria-label="От Filmograf" />
            )}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Author userId={collection.userId} />
            <span aria-hidden>·</span>
            <span>{pluralize(collection.movies.length, ["фильм", "фильма", "фильмов"])}</span>
            {!collection.isPublic && (
              <span className="flex items-center gap-1">
                <Lock className="size-3.5" /> скрытая
              </span>
            )}
          </div>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {tags.map((t) => (
              <span key={t.id} className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
                #{t.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-1 grid grid-cols-1 gap-2">
          {isOwner ? (
            <Button
              variant="secondary"
              className="h-11 rounded-xl font-bold ring-1 ring-border"
              onClick={() => openModal("update-bookmark", { collection })}
            >
              <Settings2 className="size-4" />
              Настроить подборку
            </Button>
          ) : (
            <Button
              className={cn("h-11 rounded-xl font-bold", isPinned && "bg-secondary text-secondary-foreground ring-1 ring-border hover:bg-secondary/80")}
              disabled={isPinning || isUnpinning}
              onClick={togglePin}
            >
              {isPinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
              {isPinned ? "Открепить" : "Закрепить в избранном"}
            </Button>
          )}
        </div>

        <div className="mt-1 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1" role="tablist">
          {(
            [
              ["movies", "Фильмы"],
              ["comments", "Обсуждение"],
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

        <div className="mt-2">
          {tab === "movies" ? (
            <CollectionMovieGrid ids={collection.movies} isOwner={isOwner} />
          ) : collection.isCommentable ? (
            <CommentWrapper />
          ) : (
            <EmptyState
              icon={MessageCircleOff}
              title="Обсуждение выключено"
              description="Автор подборки отключил комментарии."
            />
          )}
        </div>
      </div>
    </div>
  );
};
