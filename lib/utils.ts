import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Return the Tailwind badge classes for an exercise/program difficulty. */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Intermediate':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Advanced':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'paid':
    case 'confirmed':
    case 'attended':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'expired':
    case 'cancelled':
    case 'failed':
    case 'no_show':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'refunded':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

/** Return Tailwind classes for equipment condition. */
export function getConditionColor(condition: string): string {
  switch (condition.toLowerCase()) {
    case 'excellent':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'good':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'fair':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'maintenance':
    case 'retired':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

/**
 * Convert a string to a URL-safe slug.
 * e.g. "Chest Press (Barbell)" → "chest-press-barbell"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Format a currency minor-unit value for display.
 * e.g. formatCurrency(700000, 'INR') → '₹7,000'
 */
export function formatCurrency(minor: number, currency = 'INR'): string {
  const divisor = currency === 'JPY' ? 1 : 100;
  const major = minor / divisor;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(major);
}

/** Format a date string or Date for display. */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

/** Return up to two initials from a full name or email. */
export function getInitials(name: string): string {
  return name
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

/** Truncate text to a maximum length, appending an ellipsis. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}


