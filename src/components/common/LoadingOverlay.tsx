import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  children,
}) => {
  return (
    <div className="relative w-full h-full">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-40 flex flex-col items-center justify-center transition-all">
          <LoadingSpinner size="md" />
          {message && <p className="mt-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{message}</p>}
        </div>
      )}
    </div>
  );
};
