"use client";

// types
import type { FC, PropsWithChildren } from "react";

// ui
import { CommonWrapper } from "@/shared/components";
import { SortingProvider } from "@/features/sort/";
import { CatalogProvider } from "@/widgets/catalog";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <CatalogProvider>
      <SortingProvider>
        <CommonWrapper>{children}</CommonWrapper>
      </SortingProvider>
    </CatalogProvider>
  );
};

export default Layout;
