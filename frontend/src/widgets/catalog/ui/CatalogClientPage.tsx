"use client";

import React from "react";
import dynamic from "next/dynamic";
import { LoadingSplashScreen } from "@/shared/components";

interface Props {
  className?: string;
}

const ActionsWrapper = dynamic(
  () => import("@/widgets/catalog").then((mod) => mod.ActionsWrapper),
  { ssr: false },
);

const CatalogTabs = dynamic(
  () => import("@/widgets/catalog").then((mod) => mod.CatalogTabs),
  {
    ssr: false,
    loading: () => <LoadingSplashScreen />,
  },
);

export const CatalogClientPage: React.FC<Props> = ({ className }) => {
  return (
    <>
      <ActionsWrapper />
      <CatalogTabs />
    </>
  );
};
