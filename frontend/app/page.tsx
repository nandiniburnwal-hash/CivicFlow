'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6f0] text-[#153b35]">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dcece5] bg-[#dcece5]/40 px-3.5 py-1 text-xs font-semibold text-[#153b35] mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#153b35]" />
              <span>Civic Issue Reporting & Resolution Tracking</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#153b35] leading-tight sm:leading-tight">
              Report and track civic issues in your community.
            </h1>

            {/* Short Subhead */}
            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-[#4a5d56] leading-relaxed">
              Civic Flow helps residents report infrastructure hazards—such as potholes, water leaks, and streetlight outages—and track resolution status with municipal authorities.
            </p>

            {/* Primary Actions: Login and Register */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-[#e2e8e4] bg-white px-6 py-3 text-sm font-semibold text-[#153b35] shadow-xs hover:bg-[#f7f6f0] transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#153b35] px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#1c4d45] transition-colors"
              >
                <span>Register</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Secondary direct links */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[#4a5d56]">
              <span>Quick Preview:</span>
              <Link href="/dashboard" className="font-semibold text-[#153b35] underline hover:opacity-80">
                Citizen Dashboard
              </Link>
              <span>•</span>
              <Link href="/report" className="font-semibold text-[#153b35] underline hover:opacity-80">
                Report Issue Form
              </Link>
              <span>•</span>
              <Link href="/admin" className="font-semibold text-[#153b35] underline hover:opacity-80">
                Admin Portal
              </Link>
            </div>
          </div>

          {/* Clean 3-step visual workflow */}
          <div className="mx-auto max-w-4xl mt-16 sm:mt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-white p-6 border border-[#e2e8e4] shadow-[0_1px_3px_0_rgba(21,59,53,0.04)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dcece5]/60 text-[#153b35] mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-bold text-[#153b35]">1. Lodge Report</h2>
                <p className="mt-1 text-xs text-[#4a5d56] leading-relaxed">
                  Submit problem details, category, and exact location in a simple, structured form.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 border border-[#e2e8e4] shadow-[0_1px_3px_0_rgba(21,59,53,0.04)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dcece5]/60 text-[#153b35] mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-bold text-[#153b35]">2. Track Progress</h2>
                <p className="mt-1 text-xs text-[#4a5d56] leading-relaxed">
                  Monitor lifecycle stages from Reported to Assigned and In Progress.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 border border-[#e2e8e4] shadow-[0_1px_3px_0_rgba(21,59,53,0.04)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dcece5]/60 text-[#153b35] mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-bold text-[#153b35]">3. Verify Resolution</h2>
                <p className="mt-1 text-xs text-[#4a5d56] leading-relaxed">
                  Review completed civic work and confirmed municipal repairs with transparent records.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
