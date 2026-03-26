"use client";

import React from 'react';
import { Button } from '@/shared/ui/button';

import { useModals } from '@/shared/hooks';

import { SortingButton } from '@/features/sort';

interface Props {
  className?: string;
}



const Page: React.FC<Props> = ({ className }) => {
  const { openModal } = useModals();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button onClick={() => openModal("search-filter")}>
        Фильтры
      </Button>
      <SortingButton />
    </div>
  );
};

export default Page;