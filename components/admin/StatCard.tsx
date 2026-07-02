import * as React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number; // percentage
    label?: string;
  };
  accentColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'text-accent',
  className,
}: StatCardProps) {
  const isPositive = trend && trend.value > 0;
  const isNeutral = trend && trend.value === 0;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        'bg-[#111] border border-white/8',
        'hover:border-white/15 transition-all duration-300 group',
        className
      )}
    >
      {/* Subtle accent glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(220,38,38,0.06) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between">
        {/* Icon */}
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            'bg-accent/10 transition-colors duration-300 group-hover:bg-accent/20',
            accentColor
          )}
        >
          {icon}
        </div>

        {/* Trend badge */}
        {trend !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg',
              isNeutral
                ? 'bg-gray-500/20 text-gray-400'
                : isPositive
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            )}
            aria-label={`${isPositive ? 'Up' : isNeutral ? 'No change' : 'Down'} ${Math.abs(trend.value)}%`}
          >
            {isNeutral ? (
              <Minus className="w-3 h-3" aria-hidden="true" />
            ) : isPositive ? (
              <TrendingUp className="w-3 h-3" aria-hidden="true" />
            ) : (
              <TrendingDown className="w-3 h-3" aria-hidden="true" />
            )}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-3xl font-black text-white tracking-tight">{value}</p>
        <p className="mt-1 text-sm font-medium text-gray-300">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        {trend?.label && <p className="mt-1 text-xs text-gray-600">{trend.label}</p>}
      </div>
    </div>
  );
}
