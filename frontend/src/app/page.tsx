// types
import { FC } from "react";

// components
import { Search } from "@/modules/Header";


const Page: FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0">
        <Search className="w-full p-4" />
      </div>
    </div>
  );
};

export default Page;
