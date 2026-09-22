import { useContext } from 'react';
import { ModalContext } from './modal.context';

export const useModals = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};
