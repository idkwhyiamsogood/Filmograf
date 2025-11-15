// types
import type { FC } from "react";

// components
import { Search } from "./Search/Search";

export const Header: FC = () => {
  return (
    <div className="w-full fixed">
      <Search className="p-2.5"/>
    </div>
  );
};
