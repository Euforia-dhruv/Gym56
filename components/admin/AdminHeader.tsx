'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, Bell, ChevronRight, ExternalLink } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { getInitials } from '@/lib/utils';

interface AdminHeaderProps {
  onMobileMenuOpen: () => void;
}

const BREADCRUMB_LABELS: Record<string, string> = {
  admin: 'Dashboard',
  equipment: 'Equipment',
  exercises: 'Exercises',
  members: 'Members',
  memberships: 'Memberships',
  contact: 'Contact',
  settings: 'Settings',
  new: 'New',
};

export function AdminHeader({ onMobileMenuOpen }: AdminHeaderProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = React.useState(false);

  // Build breadcrumb from pathname
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: BREADCRUMB_LABELS[seg] ?? seg,
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  // Close dropdown on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('[data-profile-menu]')) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? 'Admin';
  const initials = getInitials(displayName);

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-white/8 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-30">
      {/* Left: Mobile menu + breadcrumb */}
      <div className="flex items-center gap-4">
        {/* Hamburger (mobile) */}
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="hidden sm:flex items-center gap-1 text-sm">
            {crumbs.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-1">
                {i > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" aria-hidden="true" />
                )}
                {crumb.isLast ? (
                  <span className="font-semibold text-white" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
          {/* Mobile: just show current page */}
          <p className="sm:hidden font-semibold text-white text-sm">
            {crumbs[crumbs.length - 1]?.label ?? 'Admin'}
          </p>
        </nav>
      </div>

      {/* Right: Actions + profile */}
      <div className="flex items-center gap-2">
        {/* View site */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all"
          aria-label="View public site"
        >
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          View Site
        </Link>

        {/* Notifications placeholder */}
        <button
          className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Notifications (3 unread)"
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full"
            aria-hidden="true"
          />
        </button>

        {/* Profile dropdown */}
        <div className="relative" data-profile-menu>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            aria-haspopup="true"
            aria-expanded={profileOpen}
            aria-label="Account menu"
            className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                {user?.email?.split('@')[0] ?? 'Admin'}
              </p>
              <p className="text-xs text-gray-500 leading-tight">Administrator</p>
            </div>
          </button>

          {profileOpen && (
            <div
              role="menu"
              aria-label="Account options"
              className="absolute right-0 mt-2 w-52 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-glass overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-white/8">
                <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/admin/settings"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Settings
                </Link>
                <Link
                  href="/"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  View Site
                </Link>
              </div>
              <div className="py-1 border-t border-white/8">
                <button
                  role="menuitem"
                  onClick={() => { signOut(); setProfileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
