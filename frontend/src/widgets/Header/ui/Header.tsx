// types
import type { FC } from "react";

// components
import { Search } from "./Search/Search";

import { navigationMenu } from "@/shared/configs";

export const Header: FC = () => {
  return (
    <div className="w-full">
      <Search />
    </div>
  );
};
