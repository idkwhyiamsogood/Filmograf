import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/movies")({
  component: MoviesLayout,
});

function MoviesLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
