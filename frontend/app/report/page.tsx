'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CIVIC_CATEGORIES } from '@/lib/mock-data';
import { API_BASE_URL } from '@/lib/api';
import {
  Landmark,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Send,
  PlusCircle,
} from 'lucide-react';

export default function ReportIssuePage() {
  const [category, setCategory] = useState<string>('Roads & Potholes');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!title.trim() || !location.trim() || !description.trim()) {
      setErrorMessage('Please fill in all required fields marked with *');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('access_token');

      // If token is not valid, redirect the user to login page
      if (!token) {
        router.replace('/login');
        return;
      }

      // Fetch the response from the API request
      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          location: location.trim(),
        }),
      });

      // If response status is not ok, then return error
      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Failed to submit report.'
        );
      }

      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to submit report. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setLocation('');
    setDescription('');
    setCategory('Roads & Potholes');
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F5F7] text-[#25364A]">
      {/* Subtle Top Civic Accent Strip */}
      <div className="h-1 w-full bg-[#17365D] border-b border-[#E9A23B] shrink-0" />

      {/* Portal Header */}
      <header className="w-full bg-[#FFFFFF] border-b border-[#D5DCE4] shrink-0">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#17365D] text-[#FFFFFF] border border-[#102845] shrink-0">
              <Landmark className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold tracking-tight text-[#17365D] leading-tight">
                CivicFlow
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-[#4A5B6E] leading-tight">
                Citizen Grievance Portal
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-sm border border-[#D5DCE4] bg-[#FFFFFF] px-3 py-1.5 text-xs sm:text-sm font-medium text-[#17365D] hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D] transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Page Header Panel */}
          <section className="bg-[#FFFFFF] border border-[#D5DCE4] border-l-4 border-l-[#17365D] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-block h-2 w-2 rounded-full bg-[#E9A23B]"
                aria-hidden="true"
              />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#17365D]">
                Citizen Grievance Submission
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17365D]">
              Report a Civic Issue
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#4A5B6E] leading-relaxed">
              Provide the details of the civic problem you would like to report.
              Your submission will be reviewed and assigned to the concerned
              officer.
            </p>
          </section>

          {/* Success State */}
          {isSubmitted ? (
            <section className="bg-[#FFFFFF] border border-[#D5DCE4] border-t-4 border-t-[#287A48] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)] p-6 sm:p-8 space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[#EAF4EE] border border-[#BBDCC7] text-[#287A48]">
                  <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#17365D]">
                    Issue Reported Successfully
                  </h2>
                  <p className="mt-1 text-sm text-[#4A5B6E] leading-relaxed">
                    Your issue has been submitted and saved successfully. You
                    can track its status from your dashboard.
                  </p>
                </div>
              </div>

              <div className="rounded-sm bg-[#F8FAFC] p-4 border border-[#D5DCE4] text-sm space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#4A5B6E]">
                    Issue Title
                  </span>
                  <span className="sm:col-span-2 font-medium text-[#17365D]">
                    {title}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 pt-2 border-t border-[#E6ECF2]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#4A5B6E]">
                    Category
                  </span>
                  <span className="sm:col-span-2 text-[#25364A]">
                    {category}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 pt-2 border-t border-[#E6ECF2]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#4A5B6E]">
                    Location
                  </span>
                  <span className="sm:col-span-2 text-[#25364A]">
                    {location}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2 border-t border-[#E6ECF2]">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#D5DCE4] bg-[#FFFFFF] px-4 py-2.5 text-sm font-semibold text-[#17365D] hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D] transition-colors"
                >
                  <PlusCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Submit Another Report</span>
                </button>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-sm bg-[#17365D] px-5 py-2.5 text-sm font-semibold text-[#FFFFFF] hover:bg-[#102845] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D] focus-visible:ring-offset-2 transition-colors"
                >
                  Return to Dashboard
                </Link>
              </div>
            </section>
          ) : (
            /* Main Complaint Form Panel */
            <section className="bg-[#FFFFFF] border border-[#D5DCE4] border-t-4 border-t-[#17365D] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)]">
              <div className="px-6 py-3.5 border-b border-[#E6ECF2] bg-[#F8FAFC] flex items-center justify-between gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#17365D]">
                  Complaint Details Form
                </h2>
                <span className="text-xs text-[#4A5B6E]">
                  <span className="text-[#B91C1C]">*</span> Required fields
                </span>
              </div>

              <div className="p-6 sm:p-7">
                {errorMessage && (
                  <div
                    role="alert"
                    className="mb-5 rounded-sm border border-[#FECACA] border-l-4 border-l-[#B91C1C] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B] flex items-start gap-2.5"
                  >
                    <AlertCircle
                      className="w-4 h-4 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* 1. Issue Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-xs font-semibold text-[#17365D] mb-1.5"
                    >
                      Issue Title <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Deep pothole causing traffic hazard near main junction"
                      className="w-full rounded-sm border border-[#CBD5E1] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#25364A] placeholder:text-[#64748B] focus:border-[#17365D] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#17365D] transition-colors"
                    />
                    <p className="mt-1 text-xs text-[#4A5B6E]">
                      Provide a brief, clear summary of the issue (5–100
                      characters).
                    </p>
                  </div>

                  {/* 2. Category & 3. Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Category */}
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-xs font-semibold text-[#17365D] mb-1.5"
                      >
                        Category <span className="text-[#B91C1C]">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-sm border border-[#CBD5E1] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#25364A] focus:border-[#17365D] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#17365D] transition-colors"
                      >
                        {CIVIC_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label
                        htmlFor="location"
                        className="block text-xs font-semibold text-[#17365D] mb-1.5"
                      >
                        Location <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Near Metro Gate 3, 5th Main Road"
                        className="w-full rounded-sm border border-[#CBD5E1] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#25364A] placeholder:text-[#64748B] focus:border-[#17365D] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#17365D] transition-colors"
                      />
                      <p className="mt-1 text-xs text-[#4A5B6E]">
                        Street address, intersection, or recognizable landmark.
                      </p>
                    </div>
                  </div>

                  {/* 4. Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-xs font-semibold text-[#17365D] mb-1.5"
                    >
                      Description <span className="text-[#B91C1C]">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the civic issue in detail, including severity and impact on pedestrians or vehicles..."
                      className="w-full rounded-sm border border-[#CBD5E1] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#25364A] placeholder:text-[#64748B] focus:border-[#17365D] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#17365D] transition-colors resize-y"
                    />
                    <p className="mt-1 text-xs text-[#4A5B6E]">
                      Include helpful context for inspection (10–500
                      characters).
                    </p>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-[#E6ECF2]">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center rounded-sm border border-[#D5DCE4] bg-[#FFFFFF] px-4 py-2.5 text-sm font-semibold text-[#25364A] hover:bg-[#F3F5F7] hover:text-[#17365D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D] transition-colors"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#17365D] px-5 py-2.5 text-sm font-semibold text-[#FFFFFF] hover:bg-[#102845] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D] focus-visible:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {isSubmitting ? 'Submitting Issue...' : 'Submit Issue'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Compact Portal Footer */}
      <footer className="w-full bg-[#17365D] text-[#FFFFFF] border-t-2 border-[#E9A23B] mt-auto shrink-0">
        <div className="mx-auto max-w-6xl px-4 py-2.5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-xs">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-0.5">
            <span className="font-bold tracking-tight">CivicFlow</span>
            <span className="text-[#B8C7D9]" aria-hidden="true">
              |
            </span>
            <span className="text-[#E2E8F0]">
              Citizen Grievance Portal — Issue reporting and complaint tracking.
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
