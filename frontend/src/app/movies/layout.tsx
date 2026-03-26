"use client";

import type { FC, PropsWithChildren } from "react";


const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>;
};

export default Layout;
