import React, { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

import { useGenreNames, useInfiniteMovies, type IMovie } from "@/entities/movie";
import { formatDuration } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";
import Link from "@/shared/ui/link";
import { RatingBadge } from "@/shared/ui/rating-badge";
import { Skeleton } from "@/shared/ui/skeleton";

const AUTOPLAY_MS = 6000;

const Slide: React.FC<{ movie: IMovie; index: number }> = ({ movie, index }) => {
  const genres = useGenreNames(movie.genreIds, 2);
  const meta = [movie.year, ...genres, formatDuration(movie.time)].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="relative block aspect-[4/5] w-full overflow-hidden rounded-3xl bg-muted sm:aspect-[16/9]"
    >
      <img
        src={movie.previewImageLink || movie.imageUrl}
        alt=""
        draggable={false}
        loading={index === 0 ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-5 text-white">
        <span className="w-fit rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase backdrop-blur-md">
          #{index + 1} в популярном
        </span>
        <h2 className="line-clamp-2 text-[28px] leading-[1.05] font-extrabold drop-shadow">
          {movie.name}
        </h2>
        <p className="text-sm text-white/80">{meta}</p>
        <div className="mt-1 flex items-center gap-3">
          <span className="press inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-lg">
            <Play className="size-4 fill-current" />
            Подробнее
          </span>
          <RatingBadge value={movie.rates?.IMDb} className="px-2 py-1 text-xs" />
          <span className="text-xs font-semibold text-white/70">IMDb</span>
        </div>
      </div>
    </Link>
  );
};

export const HomeHero: React.FC = () => {
  const { movies, isLoading } = useInfiniteMovies({ type: "popular", pageSize: 10 });
  const slides = movies.slice(0, 5);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  // Текущий слайд по позиции скролла.
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  // Автопрокрутка, пауза пока пользователь держит палец на баннере.
  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) goTo((active + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [active, slides.length]);

  if (isLoading) {
    return (
      <div className="px-4">
        <Skeleton className="aspect-[4/5] w-full rounded-3xl sm:aspect-[16/9]" />
      </div>
    );
  }

  if (!slides.length) return null;

  return (
    <section aria-label="Популярное сейчас" className="flex flex-col gap-3">
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={() => (pausedRef.current = true)}
        onPointerUp={() => (pausedRef.current = false)}
        onPointerCancel={() => (pausedRef.current = false)}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
      >
        {slides.map((movie, i) => (
          <div key={movie.id} className="w-full shrink-0 snap-center px-4">
            <Slide movie={movie} index={i} />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-1.5" role="tablist">
        {slides.map((movie, i) => (
          <button
            key={movie.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Слайд ${i + 1}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === active ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30",
            )}
          />
        ))}
      </div>
    </section>
  );
};
