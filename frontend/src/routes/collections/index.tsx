import { createFileRoute } from "@tanstack/react-router";

import { FavoriteClientPage } from "../-components/FavoriteClientPage";

export const Route = createFileRoute("/collections/")({
  component: CollectionsIndexPage,
});

function CollectionsIndexPage() {
  return (
    <div>
      <FavoriteClientPage />
    </div>
  );
}
