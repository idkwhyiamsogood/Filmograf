import React, { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const CommonWrapper: React.FC<Props> = ({ children }) => {
  return (
    <div className='max-w-[95%] my-2 mx-auto flex flex-col gap-5'>
      {children}
    </div>
  );
};
