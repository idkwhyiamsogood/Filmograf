import React from 'react';
import { Widget } from '@/widgets/test-auth/widget';

interface Props {
  className?: string;
}

const Page: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Widget />
    </div>
  );
};

export default Page;