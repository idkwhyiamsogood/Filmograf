import { createFileRoute } from "@tanstack/react-router";

import { BookmarksPage } from "./-components/BookmarksPage";

// Избранные (закреплённые) подборки — вкладка «Закладок».
export const Route = createFileRoute("/favorites")({
  component: () => <BookmarksPage initialTab="pinned" />,
});
