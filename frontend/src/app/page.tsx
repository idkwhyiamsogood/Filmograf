"use client";

// types
import { FC } from "react";

// ui
import { MoviesSection } from "@/widgets/MovieSection";

// hooks
import { useAuth, useModals } from "@/shared/hooks";
import { useEffect } from "react";

const Page: FC = () => {
  const { openModal } = useModals();
  const { token } = useAuth();

  useEffect(() => {
    !token && openModal("authorization-menu");
  }, []);

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
