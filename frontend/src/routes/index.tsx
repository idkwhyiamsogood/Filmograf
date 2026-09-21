import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { MoviesSection } from "@/widgets/MovieSection";
import { CollectionsSection } from "@/widgets/CollectionSection";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { LoadingSplashScreen } from "@/shared/components";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAndCheck = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          GoogleAuth.initialize({
            clientId:
              "341334726956-oo7rlsn0743ot821mdqoaj5e6uk442vr.apps.googleusercontent.com",
            scopes: ["profile", "email"],
            grantOfflineAccess: true,
          });
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAndCheck();
  }, []);

  if (isLoading) return <LoadingSplashScreen />;

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
}
