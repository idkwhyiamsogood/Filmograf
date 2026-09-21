import { createFileRoute } from "@tanstack/react-router";

import { CollectionClientPage } from "../-components/CollectionClientPage";

export const Route = createFileRoute("/collections/$id")({
  component: CollectionClientPage,
});
