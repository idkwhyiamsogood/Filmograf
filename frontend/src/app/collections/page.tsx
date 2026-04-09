import React from 'react'

// import { CommentWrapper } from '@/widgets/comments/CommentWrapper';
import { FavoriteClientPage } from "./FavoriteClientPage";

export async function generateStaticParams() {
  return [];
}
export const dynamicParams = true;

const Page: React.FC = () => {
  return (
    <div>
      <FavoriteClientPage />
    </div>
  );
};

export default Page;