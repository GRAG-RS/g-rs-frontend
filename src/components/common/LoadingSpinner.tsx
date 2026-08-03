import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className, size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div
        className={cn(
          'animate-spin rounded-full border-slate-200 border-t-blue-600',
          sizes[size],
          className
        )}
      />
    </div>
  );
};
