import { type FC } from "react";
import MovieClientPage from "../MovieClientPage";

export async function generateStaticParams() {
  return [];
}
export const dynamicParams = true;
const Page: FC = () => {
  return (
    <MovieClientPage />
  )
};

export default Page;
