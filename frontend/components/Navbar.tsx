'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  PlusCircle,
  Building2,
} from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Report Issue', href: '/report' },
    { name: 'Admin Portal', href: '/admin' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-[#e2e8e4]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#153b35] text-white transition-opacity group-hover:opacity-90">
            <Building2 className="h-4.5 w-4.5" />
          </div>
          <span className="text-base font-bold tracking-tight text-[#153b35]">
            Civic<span className="text-[#e7a84b]">Flow</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#dcece5] text-[#153b35]'
                    : 'text-[#4a5d56] hover:text-[#153b35] hover:bg-[#f7f6f0]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/login"
            className="px-3.5 py-1.5 text-xs font-semibold text-[#153b35] hover:bg-[#f7f6f0] rounded-lg transition-colors border border-transparent hover:border-[#e2e8e4]"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="px-3.5 py-1.5 text-xs font-semibold text-[#153b35] bg-white border border-[#e2e8e4] hover:bg-[#f7f6f0] rounded-lg transition-colors"
          >
            Register
          </Link>
          <Link
            href="/report"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#153b35] hover:bg-[#1c4d45] rounded-lg transition-colors ml-1 shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Report Issue
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-lg text-[#153b35] hover:bg-[#f7f6f0] focus:outline-none"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Toggle main menu</span>
            {mobileMenuOpen ? (
              <X className="block h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="block h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#e2e8e4] bg-white px-4 pt-2 pb-4 space-y-2">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                  pathname === link.href
                    ? 'bg-[#dcece5] text-[#153b35] font-semibold'
                    : 'text-[#4a5d56] hover:bg-[#f7f6f0]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#e2e8e4] flex flex-col gap-2">
            <Link
              href="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#153b35] hover:bg-[#1c4d45] rounded-lg"
            >
              <PlusCircle className="w-4 h-4" />
              Report Issue
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-3 py-2 text-xs font-medium text-[#153b35] bg-[#f7f6f0] hover:bg-[#dcece5]/40 rounded-lg border border-[#e2e8e4]"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-3 py-2 text-xs font-medium text-[#153b35] border border-[#e2e8e4] hover:bg-[#f7f6f0] rounded-lg bg-white"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

