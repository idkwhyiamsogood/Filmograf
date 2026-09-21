'use client';

import { useContext } from 'react';
import { ModalContext } from '../context';

export function useModals() {
  const context = useContext(ModalContext);
  
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  
  return context;
}