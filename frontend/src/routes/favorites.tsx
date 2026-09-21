import { createFileRoute } from "@tanstack/react-router";

import { CommonWrapper } from "@/shared/components";
import { LoadingSplashScreen } from "@/shared/components";
import { FavoritesClientPage } from "./-components/FavoritesClientPage";
import { useCollectionPins } from "@/entities/collection-pins/";

export const Route = createFileRoute("/favorites")({
  component: FavoritesRoute,
});

function FavoritesPage() {
  const { data: pinned, isLoading: isPinnedLoading } = useCollectionPins();

  if (isPinnedLoading) {
    return <LoadingSplashScreen />;
  }

  if (!pinned || pinned.length === 0) {
    return (
      <div className="flex flex-col gap-2.5">
        <span className="text-[20px] font-bold">Избранные подборки</span>
        <div className="flex items-center justify-center">
          Вы еще не добавили подборки в избранное.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[20px] font-bold">Избранные подборки</span>
      <FavoritesClientPage pinned={pinned} />
    </div>
  );
}

function FavoritesRoute() {
  return (
    <CommonWrapper>
      <FavoritesPage />
    </CommonWrapper>
  );
}
