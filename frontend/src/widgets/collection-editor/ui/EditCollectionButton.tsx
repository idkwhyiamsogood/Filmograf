"use client";

import React from 'react';

import { Button } from '@/shared/ui/button';
import { Settings } from 'lucide-react';

import { useModals } from '@/shared/hooks';

export const EditCollectionButton: React.FC = () => {
  const { openModal } = useModals();

  const handleOpenModal = () => {
    openModal("update-bookmark");
  }

  return (
    <Button variant={"secondary"} onClick={handleOpenModal} className='max-w-full'>
      Настроить <Settings /> 
    </Button>
  );
};
