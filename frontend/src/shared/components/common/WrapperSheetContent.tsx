import React from "react";

import type { PropsWithChildren } from "react";

export const WrapperSheetContent: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="ml-auto px-3 flex flex-col gap-2.5 w-full">{children}</div>;
};
