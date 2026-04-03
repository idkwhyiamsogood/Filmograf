import React from 'react'

// import { CommentWrapper } from '@/widgets/comments/CommentWrapper';
import { CollectionsClientPage } from "./CollectionsClientPage";

export async function generateStaticParams() {
  return [];
}
export const dynamicParams = true;

const Page: React.FC = () => {
  return (
    <div>
      <CollectionsClientPage />
    </div>
  );
};

export default Page;