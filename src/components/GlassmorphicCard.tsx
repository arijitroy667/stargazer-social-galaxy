
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div
      className={cn(
        'backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl shadow-2xl',
        'hover:bg-white/20 transition-all duration-300',
        'dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10',
        className
      )}
    >
      {children}
    </div>
  );
};
