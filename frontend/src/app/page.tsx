// types
import { FC } from "react";

// ui
import { MoviesSection } from "@/widgets/MovieSection";
import { CollectionsSection } from "@/widgets/CollectionSection";

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
        viewAllHref="/catalog?type=Movie&searchType=popular"
      />
      <MoviesSection
        title="Рекомендованные"
        type="recommended"
        viewAllHref="/catalog?type=Movie?searchType=recommended"
      />
      <CollectionsSection
        title="Рекомендованные"
        type="recommended"
        carouselType="partial"
        viewAllHref="/catalog?type=Collection&searchType=recommended"
      />
      <CollectionsSection
        title="Популярные"
        type="popular"
        carouselType="partial"
        viewAllHref="/catalog?type=Collection&searchType=popular"
      />
    </div>
  );
};

export default Page;
