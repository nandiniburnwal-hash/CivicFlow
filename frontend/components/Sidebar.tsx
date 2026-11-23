'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FilePlus2,
  Shield,
  User,
  ListFilter,
} from 'lucide-react';

interface SidebarProps {
  variant?: 'citizen' | 'admin' | 'officer';
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Sidebar({ variant = 'citizen' }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = variant === 'admin';

  const citizenNavItems = [
    { name: 'My Reports', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Report Issue', href: '/report', icon: FilePlus2 },
  ];

  const adminNavItems = [
    { name: 'Issue Management', href: '/admin', icon: ListFilter },
    { name: 'Citizen Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  const navItems = isAdmin ? adminNavItems : citizenNavItems;

  return (
    <aside className="w-full lg:w-60 shrink-0 bg-white border-r border-[#e2e8e4] flex flex-col justify-between py-6 px-4">
      <div className="space-y-6">
        {/* Role badge */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[#f7f6f0] border border-[#e2e8e4]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4a5d56]">
            {isAdmin ? 'Admin Portal' : 'Citizen Portal'}
          </span>
          <span className="flex h-2 w-2 rounded-full bg-[#153b35]" />
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#4a5d56] px-2 pb-1">
            Menu
          </p>
          {navItems.map((item) => {
            const isCurrent = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-[#dcece5] text-[#153b35] font-semibold'
                    : 'text-[#4a5d56] hover:text-[#153b35] hover:bg-[#f7f6f0]'
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isCurrent ? 'text-[#153b35]' : 'text-[#4a5d56]'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile footer */}
      <div className="pt-4 border-t border-[#e2e8e4]">
        <div className="flex items-center gap-2.5 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dcece5] text-[#153b35]">
            {isAdmin ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#153b35] truncate">
              {isAdmin ? 'Municipal Admin' : 'Alex Morgan'}
            </p>
            <p className="text-[10px] text-[#4a5d56] truncate">
              {isAdmin ? 'admin@example.gov' : 'alex@example.com'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

