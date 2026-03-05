import React from 'react';
import { ThemeSwitcher } from './ui/ThemeSwitcher';

interface Props {
  className?: string;
}

export const ThemeLayout: React.FC<Props> = ({ className }) => {
  return (
    <div className="fixed right-50 bottom-50">
      <ThemeSwitcher />
    </div>
  );
};
