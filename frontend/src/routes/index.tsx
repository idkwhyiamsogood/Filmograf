import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { MoviesSection } from "@/widgets/MovieSection";
import { CollectionsSection } from "@/widgets/CollectionSection";
import { HomeHero } from "@/widgets/HomeHero";
import { UserLogo, useUser } from "@/entities/user";
import Link from "@/shared/ui/link";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const greeting = () => {
  const h = new Date().getHours();
  if (h < 6) return "Доброй ночи";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
};

function HomeHeader() {
  const { user, isGuest } = useUser();
  const firstName = !isGuest && user?.name ? user.name.split(" ")[0] : null;

  return (
    <header className="flex flex-col gap-4 px-4 pt-safe">
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{greeting()}</p>
          <h1 className="text-2xl leading-tight font-extrabold text-balance">
            {firstName ? `${firstName}, что посмотрим?` : "Что посмотрим сегодня?"}
          </h1>
        </div>
        <Link href="/profile" aria-label="Профиль" className="press shrink-0">
          <UserLogo
            logo={isGuest ? undefined : user?.avatarUrl}
            name={isGuest ? "Гость" : user?.name}
            className="size-11 ring-2 ring-primary/40"
          />
        </Link>
      </div>

      <Link
        href="/catalog?focus=1"
        className="press flex h-12 items-center gap-3 rounded-2xl bg-muted px-4 text-[15px] text-muted-foreground"
      >
        <Search className="size-5" />
        Фильмы, подборки, жанры
      </Link>
    </header>
  );
}

function HomePage() {
  const { isGuest } = useUser();

  return (
    <div className="flex flex-col gap-8 pb-4 animate-fade-up">
      <HomeHeader />
      <HomeHero />
      <MoviesSection
        title="Вы недавно смотрели"
        type="history"
        limit={10}
        viewAllHref="/history"
      />
      <MoviesSection
        title="Топ-10 по IMDb"
        subtitle="Лучшие фильмы всех времён"
        type="top"
        variant="ranked"
        limit={10}
        viewAllHref="/top"
      />
      <MoviesSection
        title="Рекомендуем"
        subtitle={isGuest ? "Оценивайте фильмы — подборка станет точнее" : "На основе ваших оценок"}
        type="recommended"
        viewAllHref="/catalog?type=Movie&searchType=recommended"
      />
      <CollectionsSection
        title="Популярные подборки"
        type="popular"
        viewAllHref="/catalog?type=Collection&searchType=popular"
      />
      <MoviesSection
        title="Сейчас популярно"
        type="popular"
        variant="list"
        limit={5}
        viewAllHref="/catalog?type=Movie&searchType=popular"
      />
      {!isGuest && (
        <CollectionsSection
          title="Подборки для вас"
          type="recommended"
          viewAllHref="/catalog?type=Collection&searchType=recommended"
        />
      )}
    </div>
  );
}
