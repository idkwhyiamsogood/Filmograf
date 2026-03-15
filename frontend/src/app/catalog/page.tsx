"use client";

import React from 'react';
import { Button } from '@/shared/ui/button';

import { useModals } from '@/shared/hooks';

import { FilterProvider } from '@/features/filter/model/context/filter.context';

import { SortingButton } from '@/features/sort';

interface Props {
  className?: string;
}



const Page: React.FC<Props> = ({ className }) => {
  const { openModal } = useModals();

  return (
    <div className={className}>
      <Button onClick={() => openModal("search-filter")}>
        open modal chlen
      </Button>
      <SortingButton />
    </div>
  );
};

export default Page;