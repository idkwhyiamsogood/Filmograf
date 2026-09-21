import React from 'react';
import type { PropsWithChildren } from 'react';

export const WrapperContent: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="px-6 py-8 mx-auto flex flex-col w-full gap-4 justify-between h-full">
      {children}
    </div>
  );
};
