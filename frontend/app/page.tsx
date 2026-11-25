'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Landmark,
  LogIn,
  UserPlus,
  ArrowRight,
  FileText,
  SearchCheck,
  CheckCircle2,
  Info,
  Menu,
  X,
} from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const workflowSteps = [
    {
      step: '1',
      text: 'Register as a citizen.',
      icon: UserPlus,
    },
    {
      step: '2',
      text: 'Submit a civic issue.',
      icon: FileText,
    },
    {
      step: '3',
      text: 'Track the progress of your complaint.',
      icon: SearchCheck,
    },
    {
      step: '4',
      text: 'Follow the issue until resolution.',
      icon: CheckCircle2,
    },
  ];

  const citizenGuidelines = [
    'Citizens need an account to submit issues.',
    'Submitted issues can be tracked through their account.',
    'Issues are reviewed and assigned to the concerned officers.',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F5F7] text-[#25364A]">
      {/* Subtle Top Civic Accent Strip */}
      <div className="h-1 w-full bg-[#17365D] border-b border-[#E9A23B] shrink-0" />

      {/* Government-Style Portal Header */}
      <header className="w-full bg-[#FFFFFF] border-b border-[#D5DCE4] shrink-0">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#17365D] text-[#FFFFFF] border border-[#102845] shrink-0">
              <Landmark className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-[#17365D] leading-tight">
                CivicFlow
              </div>
              <p className="text-xs font-medium text-[#4A5B6E] leading-tight">
                Citizen Grievance Management Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-1"
          >
            <Link
              href="/"
              className="px-3.5 py-2 text-sm font-semibold text-[#17365D] border-b-2 border-[#17365D]"
            >
              Home
            </Link>
            <a
              href="#about-civicflow"
              className="px-3.5 py-2 text-sm font-medium text-[#25364A] hover:text-[#17365D] hover:bg-[#F3F5F7] rounded-sm transition-colors"
            >
              About CivicFlow
            </a>
            <a
              href="#citizen-help"
              className="px-3.5 py-2 text-sm font-medium text-[#25364A] hover:text-[#17365D] hover:bg-[#F3F5F7] rounded-sm transition-colors"
            >
              Help
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-sm border border-[#D5DCE4] text-[#17365D] hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="md:hidden border-t border-[#D5DCE4] bg-[#FFFFFF] px-4 py-2 space-y-1"
          >
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-[#17365D] bg-[#F3F5F7] rounded-sm"
            >
              Home
            </Link>
            <a
              href="#about-civicflow"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#25364A] hover:bg-[#F3F5F7] rounded-sm"
            >
              About CivicFlow
            </a>
            <a
              href="#citizen-help"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#25364A] hover:bg-[#F3F5F7] rounded-sm"
            >
              Help
            </a>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center">
        <div className="mx-auto max-w-6xl w-full px-4 py-4 sm:px-6 lg:px-8 lg:py-3 space-y-3.5 lg:space-y-4">
          {/* Welcome Section */}
          <section
            id="about-civicflow"
            className="bg-[#FFFFFF] border border-[#D5DCE4] border-l-4 border-l-[#17365D] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)] px-5 py-3.5 lg:px-6 lg:py-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-block h-2 w-2 rounded-full bg-[#E9A23B]"
                aria-hidden="true"
              />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#17365D]">
                Citizen Service Access
              </span>
            </div>

            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#17365D] leading-snug">
              Welcome to CivicFlow
            </h1>

            <p className="mt-0.5 text-sm sm:text-base font-semibold text-[#287A48]">
              Your Voice. Your Community. Better Civic Services.
            </p>

            <p className="mt-1.5 text-sm text-[#25364A] leading-relaxed max-w-4xl">
              CivicFlow provides a simple digital platform for citizens to report
              civic issues, monitor complaint progress and stay informed about
              their resolution.
            </p>
          </section>

          {/* Two Primary Access Panels */}
          <section
            aria-label="Citizen access options"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5"
          >
            {/* Option A – Existing Citizen */}
            <div className="bg-[#FFFFFF] border border-[#D5DCE4] border-t-4 border-t-[#17365D] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)] p-4 lg:p-5 flex flex-col justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#EDF2F7] border border-[#D5DCE4] text-[#17365D]">
                  <LogIn className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#4A5B6E]">
                    Registered Users
                  </span>
                  <h2 className="text-lg font-bold text-[#17365D] leading-snug">
                    Existing Citizen
                  </h2>
                  <p className="mt-1 text-sm text-[#25364A] leading-snug">
                    Access your account and track your reported issues.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E6ECF2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs text-[#4A5B6E]">
                  Sign in with your registered email
                </span>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#17365D] px-4 py-2 text-sm font-semibold text-[#FFFFFF] hover:bg-[#102845] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D] focus-visible:ring-offset-2 transition-colors shrink-0"
                >
                  <span>Citizen Login</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Option B – New Citizen */}
            <div className="bg-[#FFFFFF] border border-[#D5DCE4] border-t-4 border-t-[#287A48] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)] p-4 lg:p-5 flex flex-col justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#EAF4EE] border border-[#C5E0CE] text-[#287A48]">
                  <UserPlus className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#4A5B6E]">
                    First-Time Users
                  </span>
                  <h2 className="text-lg font-bold text-[#17365D] leading-snug">
                    New Citizen
                  </h2>
                  <p className="mt-1 text-sm text-[#25364A] leading-snug">
                    Create an account to report and track civic issues.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E6ECF2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs text-[#4A5B6E]">
                  Quick registration for citizens
                </span>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#287A48] px-4 py-2 text-sm font-semibold text-[#FFFFFF] hover:bg-[#1F6139] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#287A48] focus-visible:ring-offset-2 transition-colors shrink-0"
                >
                  <span>Citizen Registration</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>

          {/* Compact Process & Information Section */}
          <section
            id="citizen-help"
            aria-label="How CivicFlow works"
            className="bg-[#FFFFFF] border border-[#D5DCE4] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)] overflow-hidden"
          >
            {/* 4-Step Process */}
            <div className="px-5 py-3 lg:py-3.5 border-b border-[#D5DCE4]">
              <div className="flex items-center gap-2 mb-2.5">
                <span
                  className="inline-block h-3.5 w-1 bg-[#E9A23B]"
                  aria-hidden="true"
                />
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#17365D]">
                  How CivicFlow Works
                </h2>
              </div>

              <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-3">
                {workflowSteps.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.step}
                      className="flex items-center gap-2.5 rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-[#17365D] text-xs font-bold text-[#FFFFFF]">
                        {item.step}
                      </span>
                      <Icon
                        className="h-4 w-4 shrink-0 text-[#287A48]"
                        aria-hidden="true"
                      />
                      <span className="text-xs sm:text-[13px] font-medium text-[#25364A] leading-snug">
                        {item.text}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Citizen Guidelines Notice */}
            <div className="bg-[#F8FAFC] px-5 py-2.5 flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#17365D] shrink-0">
                <Info
                  className="h-4 w-4 text-[#E9A23B] shrink-0"
                  aria-hidden="true"
                />
                <span>Portal Guidelines:</span>
              </div>

              <ul className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap items-start sm:items-center gap-1.5 sm:gap-x-5 text-xs text-[#25364A]">
                {citizenGuidelines.map((line) => (
                  <li key={line} className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[#287A48] shrink-0"
                      aria-hidden="true"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>

      {/* Compact Portal Footer */}
      <footer className="w-full bg-[#17365D] text-[#FFFFFF] border-t-2 border-[#E9A23B] shrink-0">
        <div className="mx-auto max-w-6xl px-4 py-2.5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-xs">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-0.5">
            <span className="font-bold tracking-tight">CivicFlow</span>
            <span className="text-[#B8C7D9]" aria-hidden="true">
              |
            </span>
            <span className="text-[#E2E8F0]">
              Digital platform for citizen civic issue reporting and complaint
              tracking.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-2 gap-y-0.5 text-[#DCE4EE] text-center sm:text-right">
            <span>© {new Date().getFullYear()} CivicFlow.</span>
            <span className="hidden sm:inline text-[#B8C7D9]" aria-hidden="true">
              •
            </span>
            <span>
              Independent civic issue management platform, not an official
              government website.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
