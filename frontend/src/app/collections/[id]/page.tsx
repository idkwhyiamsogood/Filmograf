import type { FC } from "react";
import { ClientPage } from "./ClientPage";

export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

const Page: FC = () => {
  return <ClientPage />;
};

export default Page;
