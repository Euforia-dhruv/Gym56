'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Dumbbell,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  BookOpen,
  X,
  BarChart3,
  FileText,
  Image,
  Star,
  HelpCircle,
  Megaphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Equipment', href: '/admin/equipment', icon: Dumbbell },
  { label: 'Exercises', href: '/admin/exercises', icon: BookOpen },
  { label: 'Contact', href: '/admin/contact', icon: Mail, badge: 3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Articles', href: '/admin/articles', icon: FileText },
  { label: 'Gallery', href: '/admin/gallery', icon: Image },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
  { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (val: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({
  collapsed,
  onCollapse,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/8 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" aria-hidden="true" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-bold text-white whitespace-nowrap overflow-hidden"
            >
              GYM <span className="text-accent">56</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav label */}
      {!collapsed && (
        <p className="px-4 pt-5 pb-2 text-xs font-semibold text-gray-600 uppercase tracking-widest">
          Navigation
        </p>
      )}

      {/* Nav Items */}
      <nav
        className="flex-1 px-2 py-2 space-y-1 overflow-y-auto"
        aria-label="Admin navigation"
      >
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={collapsed ? item.label : undefined}
              aria-current={active ? 'page' : undefined}
              onClick={onMobileClose}
              className={cn(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl',
                'transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]',
                active
                  ? 'bg-accent/15 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {/* Active indicator */}
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full"
                  aria-hidden="true"
                />
              )}

              <item.icon
                className={cn('w-5 h-5 flex-shrink-0', active ? 'text-accent' : '')}
                aria-hidden="true"
              />

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Badge */}
              {item.badge && !collapsed && (
                <span className="ml-auto flex-shrink-0 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <span
                  className="absolute left-full ml-3 px-2 py-1 rounded-lg bg-[#1a1a1a] border border-white/10 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                  aria-hidden="true"
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden md:block p-3 border-t border-white/8 flex-shrink-0">
        <button
          onClick={() => onCollapse(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0',
          'bg-[#0d0d0d] border-r border-white/8',
          'transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-56'
        )}
        aria-label="Admin sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
              onClick={onMobileClose}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onMobileClose(); } }}
              aria-label="Close sidebar"
              role="button"
              tabIndex={0}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-[#0d0d0d] border-r border-white/8 md:hidden flex flex-col"
              aria-label="Admin sidebar"
            >
              {/* Mobile close */}
              <button
                onClick={onMobileClose}
                aria-label="Close sidebar"
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
