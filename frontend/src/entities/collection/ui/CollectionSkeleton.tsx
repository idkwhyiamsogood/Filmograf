import React from 'react';

interface Props {
  className?: string;
}

export const CollectionSkeleton: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      
    </div>
  );
};
