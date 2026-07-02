import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = 'rectangular', width, height, style, ...props }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading…"
      className={cn(
        'animate-pulse bg-white/5',
        variant === 'circular' ? 'rounded-full' : 'rounded-xl',
        variant === 'text' && 'rounded-md h-4',
        className
      )}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl p-6 space-y-4" aria-hidden="true">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-1/5 h-3" />
        </div>
      </div>
      <Skeleton className="w-full h-24" />
      <div className="flex gap-2">
        <Skeleton className="w-16 h-6" />
        <Skeleton className="w-20 h-6" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 px-4" aria-hidden="true">
      <Skeleton variant="circular" width={36} height={36} />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-1/4 h-3.5" />
        <Skeleton className="w-1/3 h-3" />
      </div>
      <Skeleton className="w-20 h-6 rounded-full" />
      <Skeleton className="w-24 h-3" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-1" aria-label="Loading table data…">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
