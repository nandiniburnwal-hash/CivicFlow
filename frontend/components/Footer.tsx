import React from 'react';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#e2e8e4] bg-white mt-auto py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#153b35] text-white">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-[#153b35]">
              Civic<span className="text-[#e7a84b]">Flow</span>
            </span>
            <span className="text-xs text-[#4a5d56] ml-2 hidden sm:inline">
              • Civic issue reporting and tracking
            </span>
          </div>

          {/* Clean Links */}
          <div className="flex items-center gap-5 text-xs font-medium text-[#4a5d56]">
            <Link href="/" className="hover:text-[#153b35] transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-[#153b35] transition-colors">
              Dashboard
            </Link>
            <Link href="/report" className="hover:text-[#153b35] transition-colors">
              Report Issue
            </Link>
            <Link href="/admin" className="hover:text-[#153b35] transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#e2e8e4] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#4a5d56]">
          <p>© {new Date().getFullYear()} Civic Flow. Built for civic transparency and community accountability.</p>
          <p className="text-[11px] text-[#4a5d56]">Frontend preview • Backend integration pending</p>
        </div>
      </div>
    </footer>
  );
}

