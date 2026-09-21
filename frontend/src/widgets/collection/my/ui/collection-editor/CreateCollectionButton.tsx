import React from 'react';

import { Button } from '@/shared/ui/button';
import { Plus } from 'lucide-react';

import { useModals } from '@/shared/hooks';

export const CreateCollectionButton: React.FC = () => {
  const { openModal } = useModals();

  const handleOpenModal = () => {
    openModal("create-bookmark");
  }
  
  return (
    <Button variant={"secondary"} onClick={handleOpenModal} className='max-w-full'>
      <Plus /> Создать
    </Button>
  );
};
