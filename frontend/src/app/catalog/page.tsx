"use client";

// types
import type { FC } from "react";

// ui
import { ActionsWrapper, CatalogTabs } from "@/widgets/Catalog/";

const Page: FC = () => {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[30px] font-bold">Каталог</span>

      <ActionsWrapper />

      <CatalogTabs />
    </div>
  );
};

export default Page;
