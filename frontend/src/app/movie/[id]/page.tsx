"use client";

import { useMovie, Review } from "@/entities/movie";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, type FC, useState } from "react";

import { CommonWrapper } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { ArrowLeft, BookmarkMinus, Send } from "lucide-react";
import { ScrollBar, ScrollArea } from "@/shared/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

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
    <div className="min-w-[80px] h-16 flex flex-col justify-center items-center px-3 bg-background rounded-lg border shadow-sm">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <span className={`text-sm font-semibold text-center ${colorClass || ""}`}>{item}</span>
    </div>
  );
};

const Page: FC = () => {
  const params = useParams();
  const router = useRouter();
  const [comment, setComment] = useState("");

  const { data } = useMovie(params.id as string);

  const handleBack = () => router.back();
  const handleBookmark = () => {
    // Здесь будет логика добавления/удаления из коллекции
    console.log("Bookmark clicked");
  };

  const handleSendComment = () => {
    if (comment.trim()) {
      console.log("Отправка комментария:", comment);
      // Здесь будет логика отправки комментария на бэкенд
      setComment("");
    }
  };

  const movie = data?.[0];

  if (!movie) {
    return (
      <ScrollArea className="relative h-full w-full">
        <CommonWrapper>
          <Button
            className="absolute top-0 left-0 text-muted-foreground"
            variant={"ghost"}
            onClick={handleBack}
          >
            <ArrowLeft size={16} />
          </Button>
          <div>Загрузка...</div>
        </CommonWrapper>
      </ScrollArea>
    );
  }

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

        <div className="flex flex-col gap-4">
          <div className="mt-16 mx-auto mb-0 max-w-[200px] z-10">
            <Image
              src={movie.imageUrl}
              alt={"обложка"}
              width={200}
              height={300}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <h3 className="text-xl font-bold text-center px-4">{movie.name} <span className="text-muted-foreground">({movie.ageLimit}+)</span></h3>
          <div className="pb-4">
            <div className="w-full bg-background/95 backdrop-blur-sm rounded-t-xl shadow-lg">
              <Tabs defaultValue="default">
                <ScrollArea className="w-full">
                  <TabsList className="rounded-b-none border-b-1 w-full sticky top-0 z-10 bg-background">
                    <TabsTrigger value="default">Подробнее</TabsTrigger>
                    <TabsTrigger value="comments">Комментарии</TabsTrigger>
                    <TabsTrigger value="collections">
                      В каких колекциях
                    </TabsTrigger>
                    {/* Добавьте еще триггеры для демонстрации скролла */}
                    <TabsTrigger value="extra1">Дополнительно 1</TabsTrigger>
                    <TabsTrigger value="extra2">Дополнительно 2</TabsTrigger>
                  </TabsList>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                
                <TabsContent value="default" className="mt-0">
                  <div className="px-2.5 py-4 flex flex-wrap gap-2 justify-center bg-muted">
                    <TagsItem label="Год выпуска" item={movie.year} />
                    <TagsItem label="Возраст" item={`${movie.ageLimit}+`} />
                    <TagsItem label="Длительность" item={movie.time} />
                    <TagsItem 
                      label="Наш Рейтинг" 
                      item={movie.rates?.[Review.Film] ? `${movie.rates[Review.Film]}/10` : "N/A"} 
                      colorClass={getRatingColor(movie.rates?.[Review.Film])}
                    />
                    <TagsItem 
                      label="Рейтинг IMDb" 
                      item={movie.rates?.[Review.IMDB] ? `${movie.rates[Review.IMDB]}/10` : "N/A"} 
                      colorClass={getRatingColor(movie.rates?.[Review.IMDB])}
                    />
                    <TagsItem 
                      label="Рейтинг Кинопоиск" 
                      item={movie.rates?.[Review.Kinopoisk] ? `${movie.rates[Review.Kinopoisk]}/10` : "N/A"} 
                      colorClass={getRatingColor(movie.rates?.[Review.Kinopoisk])}
                    />
                  </div>
                  <ScrollArea className="h-64">
                    <div className="px-4 py-4">
                      <h4 className="text-lg font-semibold mb-2">Описание</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {movie.description}
                      </p>
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="comments">
                  <div className="px-4 py-4">
                    <div className="flex gap-2 items-center mb-6">
                      <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                        placeholder="Напишите комментарий..."
                        className="flex-1 px-4 py-3 rounded-full border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                      <Button
                        onClick={handleSendComment}
                        size="icon"
                        className="rounded-full w-12 h-12 flex items-center justify-center"
                        disabled={!comment.trim()}
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                    
                    <div className="bg-muted rounded-lg p-4 min-h-[200px]">
                      <div className="text-left text-sm font-medium text-muted-foreground mb-4">
                        Всего комментариев: 0
                      </div>
                      
                      <div className="space-y-4">
                        <div className="text-center text-muted-foreground text-sm py-8">
                          Пока нет комментариев. Будьте первым!
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="collections">
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    <p>Информация о коллекциях скоро будет доступна...</p>
                  </div>
                </TabsContent>
                <TabsContent value="extra1">
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    <p>Актерский состав..</p>
                  </div>
                </TabsContent>
                <TabsContent value="extra2">
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    <p>Техническая информация о фильме...</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

     
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          className="rounded-full bg-black/80 hover:bg-black text-white p-0 w-10 h-10 flex items-center justify-center shadow-lg transition-colors"
          onClick={handleBookmark}
        >
          <BookmarkMinus size={18} />
        </Button>
        <Button
          className="rounded-full bg-black/80 hover:bg-black text-white p-0 w-10 h-10 flex items-center justify-center shadow-lg transition-colors"
        >
          {}
        </Button>
      </div>
    </div>
  );
};

export default Page;
