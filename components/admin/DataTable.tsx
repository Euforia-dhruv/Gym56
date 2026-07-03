'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Table, Column } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { SearchBar } from '@/components/admin/SearchBar';

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  toolbar?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
  filterFn?: (row: T, query: string) => boolean;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  searchable = true,
  searchPlaceholder,
  pageSize = 10,
  toolbar,
  emptyMessage,
  className,
  filterFn,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [sortKey, setSortKey] = React.useState<string | undefined>();
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');

  // Filter
  const filtered = React.useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      filterFn
        ? filterFn(row, q)
        : Object.values(row as Record<string, unknown>).some((v) =>
            String(v ?? '').toLowerCase().includes(q)
          )
    );
  }, [data, query, filterFn]);

  // Sort
  const sorted = React.useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey] ?? '';
      const bv = (b as Record<string, unknown>)[sortKey] ?? '';
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  // Reset page when query/sort changes
  React.useEffect(() => setPage(1), [query, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Toolbar row */}
      {(searchable || toolbar) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {searchable && (
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder={searchPlaceholder}
              className="w-full sm:w-72"
            />
          )}
          {toolbar && <div className="flex items-center gap-3 ml-auto">{toolbar}</div>}
        </div>
      )}

      {/* Results count */}
      <p aria-live="polite" className="text-xs text-gray-500">
        {loading
          ? 'Loading…'
          : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}${
              query ? ` for "${query}"` : ''
            }`}
      </p>

      {/* Table */}
      <div className="rounded-2xl border border-white/8 overflow-hidden bg-[#0d0d0d]">
        <Table
          columns={columns}
          data={paged}
          keyExtractor={keyExtractor}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          loading={loading}
          emptyMessage={emptyMessage}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </p>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
