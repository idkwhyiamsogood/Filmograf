// types
import { FC } from "react";

// ui
import { MoviesSection } from "@/widgets/MovieSection";

export const dynamicParams = true;

const Page: FC = () => {
  return (
    <div className="flex flex-col gap-1">
      <MoviesSection title="Топ" type="top" viewAllHref="/top" />
      <MoviesSection
        title="Популярные"
        type="popular"
        pageSize={10}
        carouselType="full"
        orientation="vertical"
        hasFetch
        viewAllHref="/catalog?type='popular'"
      />
      <MoviesSection
        title="Рекомендованные"
        type="recommended"
        viewAllHref="/catalog?type='recommended'"
      />
    </div>
  );
};

export default Page;
