import type { FC, PropsWithChildren } from "react";

import { CommonWrapper } from "@/shared/components";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

export default Layout;
