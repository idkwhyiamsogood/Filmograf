"use client";

// types
import type { FC } from "react";

// components
import { Search } from "./Search/Search";

import { navigationMenu } from "@/shared/constants";

export const Header: FC = () => {
  return (
    <div className="w-full">
      <Search />
    </div>
  );
};
