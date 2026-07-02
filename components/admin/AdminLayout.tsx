'use client';

import * as React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ToastProvider } from '@/components/ui/Toast';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar
          collapsed={collapsed}
          onCollapse={setCollapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Main content area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <AdminHeader onMobileMenuOpen={() => setMobileOpen(true)} />
          <main
            id="admin-main"
            className="flex-1 overflow-y-auto"
          >
            <div className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
