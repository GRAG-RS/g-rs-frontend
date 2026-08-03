import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative", className)}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn("px-6 py-4.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between", className)}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn("px-6 py-5", className)}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardProps> = ({ children, className }) => {
  return (
    <h3 className={cn("text-base font-bold text-slate-900 leading-snug tracking-tight", className)}>
      {children}
    </h3>
  );
};
