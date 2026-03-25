import React from 'react'

import { CommentWrapper } from '@/widgets/comments/CommentWrapper';

interface Props {
  className?: string;
}

const Page: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <CommentWrapper />
    </div>
  );
};

export default Page;