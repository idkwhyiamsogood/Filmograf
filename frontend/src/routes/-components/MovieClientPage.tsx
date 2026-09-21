import { Review, useMovie, useMyRates } from "@/entities/movie";
import { Image } from "@/shared/ui/image";
import { useParams, useRouter } from "@/shared/lib/router-compat";
import { useState, useEffect, type FC } from "react";

import { LoadingSplashScreen } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ArrowLeft, Star } from "lucide-react";

import { useGenres } from "@/entities/genres";
import { CommentWrapper } from "@/widgets/comments/CommentWrapper";
import { GenreWrapper } from "@/entities/genres";
import { MovieToCollection } from "@/features/movie/movie-to-collection";
import { useRateMovie } from "@/features/movie/movie-rate";

interface Props {
  label: string;
  item: string;
  colorClass?: string;
}

const getRatingColor = (rating: number | undefined): string => {
  if (!rating) return "";
  if (rating <= 3) return "text-red-700";
  if (rating <= 6.5) return "text-yellow-600";
  return "text-green-600";
};

const TagsItem: FC<Props> = ({ label, item, colorClass }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-full shadow-sm">
      <span className="text-xs text-muted-foreground font-medium">
        {label}:
      </span>
      <span className={`text-sm font-semibold ${colorClass || ""}`}>
        {item}
      </span>
    </div>
  );
};

export const MovieClientPage = () => {
  const params = useParams();
  const router = useRouter();

  const { data } = useMovie(params.id as string);
  const { data: genres } = useGenres();
  const { mutate: rateMovie } = useRateMovie();

  const movie = data?.[0];

  const [userRating, setUserRating] = useState(0);
  const [value, setValue] = useState<string>("default");

  const handleBack = () => router.back();

  const handleSubmitRating = () => {
    if (userRating > 0) {
      rateMovie({ rate: userRating, id: params.id as string });
    }
  };

  const rates = movie?.rates;

  useEffect(() => {
    if (rates?.ByUser) {
      setUserRating(rates?.ByUser);
    }
  }, [movie]);

  if (!movie) {
    return <LoadingSplashScreen />;
  }

  return (
    <div className="relative w-full">
      <Button
        className="absolute top-0 left-0 text-accent-foreground z-20 border-1"
        variant="ghost"
        onClick={handleBack}
      >
        <ArrowLeft size={16} />
      </Button>

      <div className="fixed inset-0 -z-10">
        <Image
          src={movie.imageUrl}
          alt="background"
          fill
          className="object-cover opacity-50 blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="flex flex-col gap-4 relative z-1">
        <div className="mt-16 mx-auto mb-0 max-w-[200px]">
          <Image
            src={movie.imageUrl}
            alt="cover"
            width={200}
            height={300}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <h3 className="text-xl font-bold text-center px-4">
          {movie.name} <span className="font-normal">({16}+)</span>
        </h3>
        <div className="">
          <div className="w-full bg-background/95 backdrop-blur-sm rounded-t-xl shadow-lg">
            <Tabs defaultValue="default" onValueChange={setValue}>
              <ScrollArea className="w-full">
                <TabsList className="rounded-b-none border-b-1 w-full sticky top-0 z-10 bg-background">
                  <TabsTrigger
                    value="default"
                    className="px-6 py-3 text-sm font-medium"
                  >
                    Подробнее
                  </TabsTrigger>
                  <TabsTrigger
                    value="comments"
                    className="px-6 py-3 text-sm font-medium"
                  >
                    Комментарии
                  </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <TabsContent value="default" className="mt-0">
                <div className="px-4 py-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <TagsItem label="Год" item={movie.year} />
                    <TagsItem label="Возраст" item={`${16}+`} />
                    <TagsItem label="Длительность" item={movie.time} />
                    <TagsItem
                      label="IMDb"
                      item={
                        rates?.IMDb
                          ? `${rates.IMDb}/10`
                          : "N/A"
                      }
                      colorClass={getRatingColor(
                        movie.rates?.[Review.IMDb],
                      )}
                    />
                  </div>
                </div>

                <div className="px-4 py-4 border-t">
                  <h4 className="text-lg font-semibold mb-4">Жанры</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.genreIds && genres ? (
                      <GenreWrapper
                        genres={genres.filter((genre) =>
                          movie.genreIds.includes(genre.id),
                        )}
                      />
                    ) : (
                      <span className="text-muted-foreground">
                        Жанры не указаны
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-4 py-4 border-t">
                  <h4 className="text-lg font-semibold mb-2">Описание</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {movie.description}
                  </p>
                </div>

                <div className="px-4 py-4 border-t">
                  <h4 className="text-lg font-semibold mb-4">Оцените фильм</h4>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setUserRating(rating)}
                          className="transition-colors"
                        >
                          <Star
                            size={20}
                            className={
                              rating <= userRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {userRating > 0
                        ? `Ваша оценка: ${userRating}/10`
                        : "Выберите оценку от 1 до 10"}
                    </div>
                    <Button
                      onClick={handleSubmitRating}
                      disabled={userRating === 0}
                      className="rounded-full"
                    >
                      Оставить оценку
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="comments">
                <CommentWrapper />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {value === "default" && <MovieToCollection filmId={movie.id} />}
    </div>
  );
};

export default MovieClientPage;
