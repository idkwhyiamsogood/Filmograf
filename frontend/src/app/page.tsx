"use client";

// types
import { FC, useEffect } from "react";

// components
import { useAuth, useModals } from "@/shared/hooks";

// ui
import { MoviesSection } from "@/widgets/MovieSection";

const Page: FC = () => {
  const { openModal } = useModals();
  const { token } = useAuth();

  useEffect(() => {
    !token && openModal("authorization-menu");
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <MoviesSection title="Топ" type="top" />
      {/* <MoviesSection title="Популярные" type="popular" /> */}
      {/* <MoviesSection title="Рекомендованные" type="recommended" /> */}
    </div>
  );
};

export default Page;
