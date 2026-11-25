'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CategoryBadge } from '@/components/CategoryBadge';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { Issue, IssueStatus } from '@/lib/types';
import { API_BASE_URL } from '@/lib/api';
import {
  Landmark,
  LogOut,
  ClipboardList,
  FilePlus2,
  PlusCircle,
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Eye,
  Menu,
  X,
  User,
} from 'lucide-react';

function CitizenStatusBadge({ status }: { status: IssueStatus }) {
  const configs: Record<
    IssueStatus,
    {
      label: string;
      bg: string;
      text: string;
      border: string;
      dot: string;
      icon: React.ReactNode;
    }
  > = {
    REPORTED: {
      label: 'Reported',
      bg: 'bg-[#EAF0F8]',
      text: 'text-[#17365D]',
      border: 'border-[#C5D5E8]',
      dot: 'bg-[#17365D]',
      icon: <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    ASSIGNED: {
      label: 'Assigned',
      bg: 'bg-[#FEF6E7]',
      text: 'text-[#9A5B13]',
      border: 'border-[#F6D89C]',
      dot: 'bg-[#E9A23B]',
      icon: <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    IN_PROGRESS: {
      label: 'In Progress',
      bg: 'bg-[#FFF2E2]',
      text: 'text-[#9C4215]',
      border: 'border-[#F7C99B]',
      dot: 'bg-[#D97706]',
      icon: <Clock className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    RESOLVED: {
      label: 'Resolved',
      bg: 'bg-[#EAF4EE]',
      text: 'text-[#287A48]',
      border: 'border-[#BBDCC7]',
      dot: 'bg-[#287A48]',
      icon: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
    },
  };

  const config = configs[status] || configs.REPORTED;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}

export default function CitizenDashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [issuesError, setIssuesError] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [citizenDisplay, setCitizenDisplay] = useState<string | null>(null);

  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    totalIssues: number;
    totalUserIssues: number;
    totalInProgressIssues: number;
    totalResolvedIssues: number;
    totalAssignedAndInProgressIssues: number;
    totalPages: number;
  } | null>(null);

  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.replace('/login');
      return;
    }

    let identity: string | null = null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      identity =
        typeof payload?.name === 'string' && payload.name.trim()
          ? payload.name.trim()
          : typeof payload?.email === 'string' && payload.email.trim()
            ? payload.email.trim()
            : null;
    } catch {
      identity = null;
    }

    const params = new URLSearchParams({
      page: String(page),
      limit: '10',
    });

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }

    if (statusFilter !== 'ALL') {
      params.set('status', statusFilter);
    }

    const fetchIssues = async () => {
      try {
        setIsLoading(true);
        setIssuesError('');

        const response = await fetch(
          `${API_BASE_URL}/issues?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('access_token');
            router.replace('/login');
            return;
          }
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setCitizenDisplay(identity);
        setIssues(data.data);
        setPagination(data.meta);
      } catch {
        setIssuesError('Unable to load issues. Please try again');
      } finally {
        setIsLoading(false);
        setIsCheckingAuth(false);
      }
    };

    fetchIssues();
  }, [router, page, searchQuery, statusFilter]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.replace('/login');
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F3F5F7] text-[#25364A]">
        <div className="h-1 w-full bg-[#17365D] border-b border-[#E9A23B]" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-[#FFFFFF] border border-[#D5DCE4] rounded-sm px-6 py-5 shadow-[0_1px_2px_rgba(23,54,93,0.06)] text-center">
            <p className="text-sm font-semibold text-[#17365D]">
              Verifying citizen session...
            </p>
            <p className="mt-1 text-xs text-[#4A5B6E]">
              Please wait while your dashboard loads.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate citizen's summary metrics from existing API response
  const totalReports = pagination?.totalUserIssues ?? 0;
  const inProgressReports = pagination?.totalAssignedAndInProgressIssues ?? 0;
  const resolvedReports = pagination?.totalResolvedIssues ?? 0;
  const hasActiveFilters =
    searchQuery.trim() !== '' || statusFilter !== 'ALL';
  const totalPages = Math.max(pagination?.totalPages ?? 1, 1);

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F5F7] text-[#25364A]">
      {/* Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

      {/* Subtle Top Civic Accent Strip */}
      <div className="h-1 w-full bg-[#17365D] border-b border-[#E9A23B] shrink-0" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full bg-[#FFFFFF] border-b border-[#D5DCE4] shrink-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
          {/* Left: Brand & Subtitle */}
          <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
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

          {/* Centre: Dashboard Link */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center"
          >
            <Link
              href="/dashboard"
              className="px-3.5 py-2 text-sm font-semibold text-[#17365D] border-b-2 border-[#17365D]"
            >
              Dashboard
            </Link>
          </nav>

          {/* Right: Authenticated Citizen & Logout */}
          <div className="hidden md:flex items-center gap-3">
            {citizenDisplay && (
              <div className="inline-flex items-center gap-2 rounded-sm border border-[#D5DCE4] bg-[#F8FAFC] px-3 py-1.5 text-xs text-[#25364A]">
                <User
                  className="h-3.5 w-3.5 text-[#17365D] shrink-0"
                  aria-hidden="true"
                />
                <span className="max-w-[200px] truncate font-medium">
                  {citizenDisplay}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#D5DCE4] bg-[#FFFFFF] px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#17365D] hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D] transition-colors"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-sm border border-[#D5DCE4] text-[#17365D] hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle portal menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#D5DCE4] bg-[#FFFFFF] px-4 py-3 space-y-2">
            {citizenDisplay && (
              <div className="flex items-center gap-2 rounded-sm border border-[#D5DCE4] bg-[#F8FAFC] px-3 py-2 text-xs text-[#25364A]">
                <User
                  className="h-3.5 w-3.5 text-[#17365D] shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate font-medium">{citizenDisplay}</span>
              </div>
            )}
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-[#17365D] bg-[#EDF2F7] rounded-sm"
            >
              Dashboard
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-sm border border-[#D5DCE4] bg-[#FFFFFF] px-3 py-2 text-sm font-semibold text-[#17365D] hover:bg-[#F3F5F7]"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Body Shell: Sidebar + Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 gap-5">
        {/* Left Sidebar */}
        <aside
          aria-label="Citizen services navigation"
          className="w-full lg:w-60 shrink-0"
        >
          <div className="bg-[#FFFFFF] border border-[#D5DCE4] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)] overflow-hidden">
            <div className="bg-[#17365D] px-4 py-2.5 border-b border-[#102845]">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#FFFFFF]">
                MY SERVICES
              </h2>
            </div>

            <nav className="p-2 grid grid-cols-2 lg:grid-cols-1 gap-1.5">
              <Link
                href="/dashboard"
                aria-current="page"
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-sm bg-[#EDF2F7] text-[#17365D] border-l-4 border-l-[#17365D]"
              >
                <ClipboardList className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>My Reports</span>
              </Link>

              <Link
                href="/report"
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-sm text-[#25364A] hover:bg-[#F3F5F7] hover:text-[#17365D] border-l-4 border-l-transparent transition-colors"
              >
                <FilePlus2
                  className="h-4 w-4 shrink-0 text-[#287A48]"
                  aria-hidden="true"
                />
                <span>Report Issue</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 min-w-0 space-y-5">
          {/* Page Header Panel */}
          <section className="bg-[#FFFFFF] border border-[#D5DCE4] border-l-4 border-l-[#17365D] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-[#E9A23B]"
                  aria-hidden="true"
                />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#17365D]">
                  Citizen Service Account
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17365D]">
                Citizen Dashboard
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#4A5B6E]">
                View and manage the civic issues you have reported.
              </p>
            </div>

            <Link
              href="/report"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#287A48] px-4 py-2.5 text-sm font-semibold text-[#FFFFFF] hover:bg-[#1F6139] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#287A48] focus-visible:ring-offset-2 transition-colors shrink-0"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>Report New Issue</span>
            </Link>
          </section>

          {/* Three Summary Statistic Cards */}
          <section
            aria-label="Issue summary statistics"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {/* Card 1: Reported Issues */}
            <div className="bg-[#FFFFFF] border border-[#D5DCE4] border-t-4 border-t-[#17365D] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)] p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A5B6E]">
                  Reported Issues
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#EAF0F8] text-[#17365D] border border-[#C5D5E8]">
                  <FileText className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-bold text-[#17365D]">
                {totalReports}
              </div>
              <p className="mt-1 text-xs text-[#4A5B6E]">
                Total issues submitted by you
              </p>
            </div>

            {/* Card 2: In Progress */}
            <div className="bg-[#FFFFFF] border border-[#D5DCE4] border-t-4 border-t-[#E9A23B] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)] p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A5B6E]">
                  In Progress
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#FEF6E7] text-[#9A5B13] border border-[#F6D89C]">
                  <Clock className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-bold text-[#17365D]">
                {inProgressReports}
              </div>
              <p className="mt-1 text-xs text-[#4A5B6E]">
                Assigned or currently under review
              </p>
            </div>

            {/* Card 3: Resolved */}
            <div className="bg-[#FFFFFF] border border-[#D5DCE4] border-t-4 border-t-[#287A48] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)] p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A5B6E]">
                  Resolved
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#EAF4EE] text-[#287A48] border border-[#BBDCC7]">
                  <CheckCircle2 className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-bold text-[#17365D]">
                {resolvedReports}
              </div>
              <p className="mt-1 text-xs text-[#4A5B6E]">
                Issues resolved and closed
              </p>
            </div>
          </section>

          {/* My Reported Issues Section */}
          <section className="bg-[#FFFFFF] border border-[#D5DCE4] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)] overflow-hidden">
            {/* Section Header + Search & Filter */}
            <div className="px-5 py-4 border-b border-[#D5DCE4] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-4 w-1 bg-[#E9A23B]"
                    aria-hidden="true"
                  />
                  <h2 className="text-base font-bold text-[#17365D]">
                    My Reported Issues
                  </h2>
                </div>
                <span className="text-xs font-medium text-[#4A5B6E]">
                  Showing {issues.length} of {pagination?.totalIssues ?? issues.length} record(s)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5B6E]"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    aria-label="Search reported issues"
                    placeholder="Search by title, location, or description..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-sm border border-[#CBD5E1] bg-[#FFFFFF] text-[#25364A] placeholder:text-[#64748B] focus:outline-none focus:border-[#17365D] focus-visible:ring-1 focus-visible:ring-[#17365D]"
                  />
                </div>

                <div className="relative sm:w-52">
                  <select
                    aria-label="Filter issues by status"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-3 pr-8 py-2 text-sm rounded-sm border border-[#CBD5E1] bg-[#FFFFFF] text-[#25364A] focus:outline-none focus:border-[#17365D] focus-visible:ring-1 focus-visible:ring-[#17365D] appearance-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="REPORTED">Reported</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                  <Filter
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5B6E] pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* Error State */}
            {issuesError && (
              <div
                role="alert"
                className="m-5 rounded-sm border border-[#FECACA] border-l-4 border-l-[#B91C1C] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B] flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{issuesError}</span>
              </div>
            )}

            {/* Table / Loading / Empty Content */}
            {isLoading ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm font-medium text-[#17365D]">
                  Loading your reported issues...
                </p>
                <p className="mt-1 text-xs text-[#4A5B6E]">
                  Fetching latest complaint records.
                </p>
              </div>
            ) : !issuesError && issues.length === 0 ? (
              <div className="px-5 py-12 text-center space-y-3">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-sm bg-[#F3F5F7] border border-[#D5DCE4] text-[#17365D]">
                  <ClipboardList className="w-5 h-5" aria-hidden="true" />
                </div>

                {hasActiveFilters ? (
                  <>
                    <div>
                      <p className="text-sm font-semibold text-[#17365D]">
                        No issues match your current search or filter
                      </p>
                      <p className="mt-1 text-xs text-[#4A5B6E]">
                        Try adjusting your search keywords or selecting a
                        different status filter.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('ALL');
                        setPage(1);
                      }}
                      className="inline-flex items-center justify-center rounded-sm border border-[#D5DCE4] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#17365D] hover:bg-[#F3F5F7] transition-colors"
                    >
                      Clear Filters
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-semibold text-[#17365D]">
                        No civic issues reported yet
                      </p>
                      <p className="mt-1 text-xs text-[#4A5B6E]">
                        Submit your first civic issue report to begin tracking
                        its resolution.
                      </p>
                    </div>
                    <Link
                      href="/report"
                      className="inline-flex items-center gap-2 rounded-sm bg-[#287A48] px-4 py-2 text-xs font-semibold text-[#FFFFFF] hover:bg-[#1F6139] transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" aria-hidden="true" />
                      <span>Report Your First Issue</span>
                    </Link>
                  </>
                )}
              </div>
            ) : !issuesError ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#D5DCE4] bg-[#F8FAFC] text-[#17365D] font-bold uppercase tracking-wider text-[11px]">
                        <th scope="col" className="py-3 px-4">
                          Issue Title
                        </th>
                        <th scope="col" className="py-3 px-4 whitespace-nowrap">
                          Category
                        </th>
                        <th scope="col" className="py-3 px-4 whitespace-nowrap">
                          Date Reported
                        </th>
                        <th scope="col" className="py-3 px-4 whitespace-nowrap">
                          Current Status
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-4 text-right whitespace-nowrap"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#E2E8F0]">
                      {issues.map((issue) => (
                        <tr
                          key={issue.id}
                          className="hover:bg-[#F8FAFC] transition-colors"
                        >
                          <td className="py-3.5 px-4 min-w-[220px] max-w-md">
                            <div className="font-semibold text-[#17365D] line-clamp-2">
                              {issue.title}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <CategoryBadge category={issue.category} size="sm" />
                          </td>

                          <td className="py-3.5 px-4 text-xs text-[#4A5B6E] whitespace-nowrap">
                            {new Date(issue.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <CitizenStatusBadge status={issue.status} />
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedIssue(issue)}
                              className="inline-flex items-center gap-1.5 rounded-sm border border-[#17365D] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#17365D] hover:bg-[#17365D] hover:text-[#FFFFFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D] transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>View Details</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-4 py-3 border-t border-[#D5DCE4] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[#4A5B6E]">
                    Page {pagination?.page ?? page} of {totalPages}
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setPage((prev) => prev - 1)}
                      disabled={page <= 1 || isLoading}
                      className="flex-1 sm:flex-none rounded-sm border border-[#D5DCE4] bg-[#FFFFFF] px-4 py-1.5 text-xs font-semibold text-[#17365D] hover:bg-[#EDF2F7] disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={
                        !pagination ||
                        page >= pagination.totalPages ||
                        isLoading
                      }
                      className="flex-1 sm:flex-none rounded-sm border border-[#D5DCE4] bg-[#FFFFFF] px-4 py-1.5 text-xs font-semibold text-[#17365D] hover:bg-[#EDF2F7] disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </section>
        </main>
      </div>

      {/* Compact Portal Footer */}
      <footer className="w-full bg-[#17365D] text-[#FFFFFF] border-t-2 border-[#E9A23B] mt-auto shrink-0">
        <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-xs">
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
