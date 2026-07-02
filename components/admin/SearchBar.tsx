'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  className,
}: SearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search
        className="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          'w-full pl-9 pr-9 py-2.5 rounded-xl text-sm',
          'bg-white/5 border border-white/10 text-white placeholder-gray-500',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black',
          'focus:border-accent transition-colors duration-200'
        )}
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-3 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
