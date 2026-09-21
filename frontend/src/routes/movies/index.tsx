import { createFileRoute } from "@tanstack/react-router";

import { MovieClientPage } from "../-components/MovieClientPage";

export const Route = createFileRoute("/movies/")({
  component: MovieClientPage,
});
