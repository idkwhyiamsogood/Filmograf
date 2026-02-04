import React from "react";

import { BookmarkSelector } from "@/widgets/BookMarkSelector";

interface Props {
  className?: string;
}

const Page: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <h1 className="text-foreground text-xl font-semibold">Закладки</h1>
      <BookmarkSelector />
    </div>
  );
};

export default Page;
