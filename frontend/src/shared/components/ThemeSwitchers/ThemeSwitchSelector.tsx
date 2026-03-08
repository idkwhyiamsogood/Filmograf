'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '@/shared/ui/switch';

import { LoadingSplashScreen } from '../fallback/LoadingSplashScreen';

interface Props {
  className?: string;
  variant?: 'default' | 'minimal';
}

export const ThemeSwitchSelector: React.FC<Props> = ({ 
  className,
  variant = 'default' 
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';
  
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  if (!mounted) {
    return <LoadingSplashScreen />;
  }

  if (variant === 'minimal') {
    return (
      <div className={className}>
        <Switch
          checked={isDark}
          onCheckedChange={toggleTheme}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-primary"
      />
      <span className="text-sm font-medium">
        {isDark ? 'Тёмная' : 'Светлая'} тема
      </span>
    </div>
  );
};