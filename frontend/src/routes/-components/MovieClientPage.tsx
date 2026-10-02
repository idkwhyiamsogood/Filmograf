import { useState, type FC, type ReactNode } from "react";
import { Bookmark, ChevronLeft, MessageCircle, Share2, Star } from "lucide-react";
import { toast } from "sonner";

import { useGenreNames, useMovieDetails } from "@/entities/movie";
import { useRequireMember } from "@/entities/user";
import { RateSheet } from "@/features/movie/movie-rate";
import { CollectionPickerSheet } from "@/features/movie/movie-to-collection";
import { CommentWrapper } from "@/widgets/comments/CommentWrapper";
import { SimilarMovies } from "@/widgets/SimilarMovies";

import { QueryErrorState } from "@/shared/components";
import { formatDuration, formatRating, imageSrcSet, optimizeImage } from "@/shared/lib";
import { useParams, useRouter } from "@/shared/lib/router-compat";
import { cn } from "@/shared/lib/utils";
import { Poster } from "@/shared/ui/poster";
import { ratingTone } from "@/shared/ui/rating-badge";
import { Skeleton } from "@/shared/ui/skeleton";

const GlassButton: FC<{ label: string; onClick: () => void; children: ReactNode }> = ({
  label,
  onClick,
  children,
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="press flex size-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md"
  >
    {children}
  </button>
);

const ExternalRating: FC<{ label: string; value?: number; logo?: string }> = ({ label, value, logo }) => {
  const has = typeof value === "number" && value > 0;
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-3">
      <span className={cn("text-[22px] leading-none font-extrabold tabular-nums", has ? ratingTone(value) : "text-muted-foreground")}>
        {has ? formatRating(value) : "—"}
      </span>
      <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
        {logo && <img src={logo} alt="" className="h-3 w-auto rounded-[2px]" />}
        {label}
      </span>
    </div>
  );
};

/** Все оценки в одной карточке: три внешних + своя (кликабельна). */
const RatingsCard: FC<{
  imdb?: number;
  kinopoisk?: number;
  film?: number;
  userRate: number;
  onRate: () => void;
}> = ({ imdb, kinopoisk, film, userRate, onRate }) => (
  <div className="flex items-stretch overflow-hidden rounded-2xl bg-card ring-1 ring-border">
    <div className="flex flex-1 divide-x divide-border">
      <ExternalRating label="IMDb" value={imdb} logo="/imdb.png" />
      <ExternalRating label="Кинопоиск" value={kinopoisk} logo="/kp.png" />
      <ExternalRating label="Filmograf" value={film} />
    </div>
    <button
      type="button"
      onClick={onRate}
      aria-label={userRate ? `Ваша оценка ${userRate}, изменить` : "Поставить оценку"}
      className="press flex w-[24%] shrink-0 flex-col items-center justify-center gap-1 bg-brand-soft text-primary"
    >
      {userRate ? (
        <span className="flex items-center gap-0.5 text-[22px] leading-none font-extrabold tabular-nums">
          <Star className="size-4 fill-current" />
          {userRate}
        </span>
      ) : (
        <Star className="size-[22px]" strokeWidth={2.2} />
      )}
      <span className="text-[11px] font-bold">{userRate ? "Ваша" : "Оценить"}</span>
    </button>
  </div>
);

const MovieSkeletonPage = () => (
  <div className="animate-pulse">
    <Skeleton className="h-[52vh] max-h-[440px] w-full rounded-none" />
    <div className="-mt-24 flex gap-4 px-4">
      <Skeleton className="aspect-[2/3] w-28 rounded-xl" />
      <div className="flex flex-1 flex-col gap-2 pt-16">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  </div>
);

export const MovieClientPage = () => {
  const params = useParams();
  const router = useRouter();
  const requireMember = useRequireMember();

  const { data: movie, isError, error, refetch } = useMovieDetails(params.id as string);
  const genres = useGenreNames(movie?.genreIds ?? []);

  const [tab, setTab] = useState<"about" | "comments">("about");
  const [expanded, setExpanded] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  if (isError) {
    return (
      <QueryErrorState
        error={error}
        onRetry={() => refetch()}
        notFoundMessage="Фильм не найден"
      />
    );
  }

  if (!movie) return <MovieSkeletonPage />;

  // Бэк присылает -1, если оценки нет.
  const userRate = movie.rates?.ByUser && movie.rates.ByUser > 0 ? movie.rates.ByUser : 0;
  const meta = [movie.year, formatDuration(movie.time), `${movie.ageLimit ?? 0}+`]
    .filter(Boolean)
    .join(" · ");

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: movie.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Ссылка скопирована");
      }
    } catch {
      // пользователь закрыл диалог «Поделиться»
    }
  };

  return (
    <div className="relative pb-6 animate-fade-up">
      {/* Hero */}
      <div className="relative h-[52vh] max-h-[440px] min-h-[320px] w-full overflow-hidden">
        <img
          src={optimizeImage(movie.previewImageLink || movie.imageUrl, 900, 65)}
          srcSet={imageSrcSet(movie.previewImageLink || movie.imageUrl, 430)}
          fetchPriority="high"
          decoding="async"
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-black/30" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
          <GlassButton label="Назад" onClick={() => router.back()}>
            <ChevronLeft className="size-6" />
          </GlassButton>
          <GlassButton label="Поделиться" onClick={share}>
            <Share2 className="size-[18px]" />
          </GlassButton>
        </div>
      </div>

      {/* Постер и заголовок */}
      <div className="relative -mt-36 flex items-end gap-4 px-4">
        <div className="w-28 shrink-0 sm:w-36">
          <Poster
            src={movie.imageUrl}
            alt={movie.name}
            priority
            width={144}
            className="shadow-2xl ring-1 ring-white/10"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 pb-1">
          <h1 className="text-2xl leading-tight font-extrabold sm:text-3xl">{movie.name}</h1>
          <p className="text-sm font-medium text-muted-foreground">{meta}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5 px-4">
        {genres.length > 0 && (
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
            {genres.map((g) => (
              <span
                key={g}
                className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Рейтинги */}
        <RatingsCard
          imdb={movie.rates?.IMDb}
          kinopoisk={movie.rates?.Kinopoisk}
          film={movie.rates?.Film}
          userRate={userRate}
          onRate={() => requireMember("оценивать фильмы", () => setRateOpen(true))}
        />

        {/* Действия */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => requireMember("оценивать фильмы", () => setRateOpen(true))}
            className="press flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-bold text-primary-foreground shadow-sm"
          >
            <Star className={cn("size-5", userRate && "fill-current")} />
            {userRate ? `Ваша оценка ${userRate}` : "Оценить"}
          </button>
          <button
            type="button"
            onClick={() => requireMember("сохранять фильмы в подборки", () => setPickerOpen(true))}
            className="press flex h-12 items-center justify-center gap-2 rounded-xl bg-secondary text-[15px] font-bold text-secondary-foreground ring-1 ring-border"
          >
            <Bookmark className="size-5" />В подборку
          </button>
        </div>

        {/* Вкладки */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1" role="tablist">
          {(
            [
              ["about", "О фильме", null],
              ["comments", "Обсуждение", MessageCircle],
            ] as const
          ).map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-bold transition-all",
                tab === value ? "bg-card shadow-sm" : "text-muted-foreground",
              )}
            >
              {Icon && <Icon className="size-4" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "about" ? (
        <div className="mt-5 flex flex-col gap-7">
          {movie.description && (
            <section className="px-4">
              <p
                className={cn(
                  "text-[15px] leading-relaxed whitespace-pre-line text-foreground/90",
                  !expanded && "line-clamp-4",
                )}
              >
                {movie.description}
              </p>
              {movie.description.length > 180 && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-1 text-sm font-bold text-primary"
                >
                  {expanded ? "Свернуть" : "Читать полностью"}
                </button>
              )}
            </section>
          )}

          <section className="mx-4 divide-y rounded-2xl bg-card text-sm ring-1 ring-border">
            {[
              ["Год", movie.year],
              ["Длительность", formatDuration(movie.time)],
              ["Возраст", `${movie.ageLimit ?? 0}+`],
              ["Жанры", genres.join(", ")],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-3">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-right font-semibold">{v}</span>
                </div>
              ))}
          </section>

          <SimilarMovies movie={movie} />
        </div>
      ) : (
        <div className="mt-4 px-4">
          <CommentWrapper />
        </div>
      )}

      <RateSheet
        open={rateOpen}
        onOpenChange={setRateOpen}
        movieId={movie.id}
        movieName={movie.name}
        poster={movie.imageUrl}
        current={userRate}
      />
      <CollectionPickerSheet open={pickerOpen} onOpenChange={setPickerOpen} movieId={movie.id} />
    </div>
  );
};

export default MovieClientPage;
