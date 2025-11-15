// types
import { FC } from "react";

import { Header } from "@/widgets/Header/ui/Header";

const Page: FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0">
        <Header />
      </div>
    </div>
  );
};

export default Page;
