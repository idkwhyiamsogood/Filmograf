import React from "react";
import { BookmarkManagement } from "@/widgets/BookmarkManagement";

interface Props {
  className?: string;
}

const Page: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <h1 className="text-foreground text-xl font-semibold">Коллекции</h1>
      <BookmarkManagement />
    </div>
  );
};

export default Page;