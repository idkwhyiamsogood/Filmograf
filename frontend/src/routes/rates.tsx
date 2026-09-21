import { createFileRoute } from "@tanstack/react-router";

import { MovieWrapper, useMyRates, useMovie } from "@/entities/movie";
import { LoadingSplashScreen, CommonWrapper } from "@/shared/components";

export const Route = createFileRoute("/rates")({
  component: RatesRoute,
});

function RatesPage() {
  const { data: myRates, isLoading: isMyRatesLoading } = useMyRates();

  const ids = myRates
    ?.map((item) => item.movieId)
    .filter((item) => item !== "undefined");

  const { data: movies, isLoading: isMoviesLoading } = useMovie(ids || "");

  if (isMoviesLoading || isMyRatesLoading) return <LoadingSplashScreen />;

  if (!movies)
    return (
      <div className="flex flex-col gap-2.5">
        <span className="text-[30px] font-bold">Мои понравившиеся</span>
        <span className="text-muted-foreground text-sm">
          Вы еще не оценили ни одного фильма
        </span>
      </div>
    );

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[30px] font-bold">Мои понравившиеся</span>
      <MovieWrapper movies={movies} />
    </div>
  );
}

function RatesRoute() {
  return (
    <CommonWrapper>
      <RatesPage />
    </CommonWrapper>
  );
}
