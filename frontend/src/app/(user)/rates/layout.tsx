"use client";

// types
import type { FC, PropsWithChildren } from "react";

// ui
import { CommonWrapper } from "@/shared/components";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <CommonWrapper>{children}</CommonWrapper>;
};

export default Layout;
