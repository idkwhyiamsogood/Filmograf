import { createFileRoute, Outlet } from "@tanstack/react-router";

import { CommonWrapper } from "@/shared/components";

export const Route = createFileRoute("/collections")({
  component: CollectionsLayout,
});

function CollectionsLayout() {
  return (
    <CommonWrapper>
      <Outlet />
    </CommonWrapper>
  );
}
