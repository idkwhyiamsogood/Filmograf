import type { FC, PropsWithChildren } from "react";

import { CommonWrapper } from "@/shared/components";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <CommonWrapper>{children}</CommonWrapper>;
};

export default Layout;
