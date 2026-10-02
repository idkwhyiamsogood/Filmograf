import { createFileRoute } from "@tanstack/react-router";

import { BookmarksPage } from "../-components/BookmarksPage";

export const Route = createFileRoute("/collections/")({
  component: () => <BookmarksPage />,
});
