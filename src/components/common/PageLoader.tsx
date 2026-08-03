import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export const PageLoader: React.FC = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
        Initializing Microservices Session...
      </p>
    </div>
  );
};
