import React from 'react'

import { CommentWrapper } from '@/widgets/comments/CommentWrapper';

export async function generateStaticParams() {
  return [];
}
export const dynamicParams = false;

const Page: React.FC = () => {
  return (
    <div>
      <CommentWrapper />
    </div>
  );
};

export default Page;