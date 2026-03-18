"use client";

import { useMovie } from "@/entities/movie";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FC } from "react";

import { Button } from "@/shared/ui/button";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ArrowLeft, BookmarkMinus } from "lucide-react";

import { getAverageGrade } from "@/shared/lib/";
import { Badge } from "@/shared/ui/badge";

import { Genre, useGenres } from "@/entities/genres";

interface GenresProps {
  genreIds: string[];
}

const GenresWrapper: FC<GenresProps> = ({ genreIds }) => {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    try {
      const { data: genresResponse } = useGenres();
      const genres = genresResponse?.data.filter(
        (genre) => genre.id in genreIds,
      );

      if (genres) setGenres(genres);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    console.log("Жанры:", genres);
  }, [genres]);

  return (
    <div className="flex flex-wrap gap-2.5 px-4">
      {genres.map((genre) => (
        <Badge variant={"secondary"} onClick={() => {}}>
          {genre.name}
        </Badge>
      ))}
    </div>
  );
};

interface DetailsProps {
  label: string;
  text: string;
}

const DetailsItem: FC<DetailsProps> = ({ label, text }) => {
  return (
    <div className="px-4 flex flex-col gap-2.5">
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-sm font-medium text-justify">{text}</p>
    </div>
  );
};

interface Props {
  label: string;
  item: string;
}

const TagsItem: FC<Props> = ({ label, item }) => {
  return (
    <div className="h-12.5 flex flex-col justify-center items-center px-2">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <span className="text-base font-medium">{item}</span>
    </div>
  );
};

const Page: FC = () => {
  const params = useParams();
  const router = useRouter();

  const { data } = useMovie(params.id as string);

  const handleBack = () => router.back();
  const handleBookmark = () => {
    // Здесь будет логика добавления/удаления из коллекции
    console.log("Bookmark clicked");
  };

  const movie = data?.[0];

  if (!movie) return;

  return (
    <div className="relative w-full h-[calc(100vh-100px)]">
      <div className="h-full">
        <Button
          className="absolute top-0 left-0 text-muted-foreground z-20"
          variant={"ghost"}
          onClick={handleBack}
        >
          <ArrowLeft size={16} />
        </Button>

        <div className="fixed inset-0 -z-10 max-h-150">
          <Image
            src={movie.imageUrl}
            alt="фоновое изображение"
            fill
            className="object-cover opacity-50 blur-sm"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="mt-15 mx-auto mb-0 max-w-50 z-10 relative">
            <Image
              src={movie.imageUrl}
              alt={"обложка"}
              width={260}
              height={1000}
              className="static w-full h-80+"
            />
            <Badge
              variant={"ghost"}
              className="absolute right-2.5 bottom-2.5 bg-muted border-1"
            >
              {getAverageGrade(movie.rates)}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-center">{movie.name}</h3>
          
          <div className="pb-16 border-1 rounded-xl">
            <div className="w-full bg-muted h-full">
              <ScrollArea className="w-full">
                <Tabs defaultValue="default">
                  <TabsList className="rounded-b-none border-b-1 w-full">
                    <TabsTrigger value="default">Подробнее</TabsTrigger>
                    <TabsTrigger value="comments">Комментарии</TabsTrigger>
                    <TabsTrigger value="collections">
                      В каких колекциях
                    </TabsTrigger>
                    <TabsTrigger value="extra1">Дополнительно 1</TabsTrigger>
                    <TabsTrigger value="extra2">Дополнительно 2</TabsTrigger>
                    <TabsTrigger value="extra3">Дополнительно 3</TabsTrigger>
                  </TabsList>
                  <ScrollBar orientation="horizontal" hidden />
                </Tabs>
              </ScrollArea>

              <Tabs defaultValue="default">
                <TabsContent value="default">
                  <ScrollArea className="flex">
                    <div className="px-2.5 py-2.5 flex">
                      <TagsItem label="Выпуск" item={movie.year} />
                      <TagsItem label="Выпуск" item={movie.year} />
                      <TagsItem label="Выпуск" item={movie.year} />
                      <TagsItem label="Выпуск" item={movie.year} />
                      <TagsItem label="Выпуск" item={movie.year} />
                      <TagsItem label="Выпуск" item={movie.year} />
                    </div>
                    <ScrollBar orientation="horizontal" hidden />
                  </ScrollArea>
                  <DetailsItem
                    label="Подробнее"
                    text={(movie.description as string) || "..."}
                  />
                  <GenresWrapper genreIds={movie.genresIds} />
                </TabsContent>
                <TabsContent value="comments">{/* контент */}</TabsContent>
                <TabsContent value="collections">{/* контент */}</TabsContent>
                <TabsContent value="extra1">{/* контент */}</TabsContent>
                <TabsContent value="extra2">{/* контент */}</TabsContent>
                <TabsContent value="extra3">{/* контент */}</TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопка с фиксированным позиционированием */}
      <Button
        className="fixed bottom-24 right-2.5 z-50 text-white bg-blue-600 rounded-full p-0 w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
        onClick={handleBookmark}
      >
        <BookmarkMinus size={24} />
      </Button>
    </div>
  );
};

export default Page;
