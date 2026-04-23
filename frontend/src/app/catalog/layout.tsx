"use client";

// types
import type { FC, PropsWithChildren } from "react";

// ui
import { CommonWrapper } from "@/shared/components";
import { SortingProvider } from "@/features/sort/";
import { CatalogProvider } from "@/widgets/catalog";
import { AuthProvider } from "@/shared/context";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <CatalogProvider>
      <SortingProvider>
        <AuthProvider>
          <CommonWrapper>{children}</CommonWrapper>
        </AuthProvider>
      </SortingProvider>
    </CatalogProvider>
  );
};

export default Layout;
