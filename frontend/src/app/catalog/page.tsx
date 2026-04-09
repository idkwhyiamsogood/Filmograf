import type { FC } from "react";
import { CatalogClientPage } from "@/widgets/catalog";


export const dynamic = 'force-dynamic';

const Page: FC = () => {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[30px] font-bold">Каталог</span>
      <CatalogClientPage />
    </div>
  );
};

export default Page;
