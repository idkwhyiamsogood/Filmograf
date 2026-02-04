import React from 'react';

interface Props {
  className?: string;
}

export const CommentSkeleton: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      
    </div>
  );
};
