import React, { lazy, Suspense } from "react";
import { LoadingSplashScreen } from "@/shared/components";

interface Props {
  className?: string;
}

const ActionsWrapper = lazy(() =>
  import("@/widgets/catalog").then((mod) => ({ default: mod.ActionsWrapper })),
);

const CatalogTabs = lazy(() =>
  import("@/widgets/catalog").then((mod) => ({ default: mod.CatalogTabs })),
);

export const CatalogClientPage: React.FC<Props> = ({ className }) => {
  return (
    <Suspense fallback={<LoadingSplashScreen />}>
      <ActionsWrapper />
      <CatalogTabs />
    </Suspense>
  );
};
