import React from "react";

import { ActionsWrapper } from "./ActionsWrapper";
import { CatalogTabs } from "./CatalogTabs";

export const CatalogClientPage: React.FC = () => (
  <>
    <div className="sticky top-0 z-20 -mx-4 bg-background/90 px-4 pt-safe pb-1 backdrop-blur-xl">
      <ActionsWrapper />
    </div>
    <CatalogTabs />
  </>
);
