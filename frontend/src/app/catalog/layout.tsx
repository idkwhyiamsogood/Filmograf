"use client";

// types
import type { FC, PropsWithChildren } from "react";

// ui
import { CommonWrapper } from "@/shared/components";
import { CatalogProvider } from "@/widgets/catalog";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <CatalogProvider>
      <CommonWrapper>{children}</CommonWrapper>
    </CatalogProvider>
  );
};

export default Layout;
