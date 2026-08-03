import React from 'react';
import { cn } from '../../utils/cn';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table = ({ children, className }: TableProps) => (
  <div className={cn("overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs", className)}>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100 bg-white">
        {children}
      </table>
    </div>
  </div>
);

export const Thead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-slate-50/80 backdrop-blur-xs">{children}</thead>
);

export const Tbody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>
);

export const Tr = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <tr className={cn("transition-colors duration-150 hover:bg-slate-50/80", className)}>{children}</tr>
);

export const Th = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <th
    scope="col"
    className={cn(
      "px-6 py-4 text-left text-[11px] font-bold tracking-wider text-slate-500 uppercase",
      className
    )}
  >
    {children}
  </th>
);

export const Td = ({ children, className, colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) => (
  <td colSpan={colSpan} className={cn("px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium", className)}>
    {children}
  </td>
);
