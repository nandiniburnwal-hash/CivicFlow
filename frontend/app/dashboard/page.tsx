'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { CategoryBadge } from '@/components/CategoryBadge';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { Issue } from '@/lib/types';
import {
  PlusCircle,
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle2,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function CitizenDashboardPage() {
  // Demonstration issues for preview
  const [issues, setIssues] = useState<Issue[]>([]); //stores data returned by backend
  const [isLoading, setIsLoading] = useState(true); //will track whether API request is in progress
  const [issuesError, setIssuesError] = useState(''); //will display an error if fetching of data fails
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  //Storing the metadata
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    totalIssues: number;
    totalUserIssues: number;
    totalInProgressIssues: number,
    totalResolvedIssues: number;
    totalPages: number;
  } | null>(null);


  // Tracking which page the user is currently viewing
  const [page, setPage] = useState(1);


  //The below code is used to when the access token is not available inside the localStorage then instead of showing the dashboard, which shouldn't be done.
  //The login page will be showed
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.replace('/login');
      return;
    }


    const params=new URLSearchParams({
      page: String(page),
      limit:'10',
    });

    if(searchQuery.trim()){
      params.set('search',searchQuery.trim());
    }

    if(statusFilter!=='ALL'){
      params.set('status',statusFilter);
    }
    const fetchIssues = async () => {
      try {
        const response = await fetch(`http://localhost:3001/issues?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('access_token');
            router.replace('/login');
            return;
          }
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setIssues(data.data);  //contains the actual issues
        setPagination(data.meta);  //contains the curr page, limit, total issues and total pages
      } catch {
        setIssuesError("Unable to load issues. Please try again");

      } finally {
        setIsLoading(false);
        setIsCheckingAuth(false);
      }
    };

    fetchIssues();

  }, [router, page, searchQuery, statusFilter]);

  //This prevents the dashboard content form appearing while the browser checks for a token
  if (isCheckingAuth) {
    return <div>Checking Authentication...</div>;
  }


  // Calculate citizen's summary metrics from current list
  const totalReports = pagination?.totalUserIssues ?? 0;
  const inProgressReports = pagination?.totalInProgressIssues ?? 0;
  const resolvedReports = pagination?.totalResolvedIssues ?? 0;
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6f0] text-[#153b35]">
      <Navbar />

      {/* Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Compact Sidebar */}
        <Sidebar variant="citizen" />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header & Primary Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8e4]">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#153b35]">
                Citizen Dashboard
              </h1>
              <p className="mt-1 text-xs text-[#4a5d56]">
                Track and review the status of reported civic hazards in your area.
              </p>
            </div>

            <Link
              href="/report"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#153b35] hover:bg-[#1c4d45] rounded-lg transition-colors shadow-xs shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue</span>
            </Link>
          </div>

          {/* Demonstration Notice */}
          {isLoading && (
            <p className="text-sm text-[#4a5d56]">
              Loading issues...
            </p>
          )}
          {issuesError && (
            <p className="text-sm text-red-600">
              {issuesError}
            </p>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="My Reports"
              value={totalReports}
              description="Total issues lodged"
              icon={FileText}
            />
            <StatCard
              title="In Progress"
              value={inProgressReports}
              description="Currently active or assigned"
              icon={Clock}
            />
            <StatCard
              title="Resolved"
              value={resolvedReports}
              description="Repairs verified and completed"
              icon={CheckCircle2}
            />
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5d56]" />
              <input
                type="text"
                placeholder="Search by title, category, or description..."
                value={searchQuery}
                onChange={(e) =>{
                   setSearchQuery(e.target.value);
                   setPage(1);
                }}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-[#e2e8e4] bg-white text-[#153b35] placeholder:text-[#4a5d56]/60 focus:outline-none focus:border-[#153b35]"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="pl-3 pr-8 py-2 text-xs rounded-lg border border-[#e2e8e4] bg-white text-[#153b35] focus:outline-none focus:border-[#153b35] appearance-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="REPORTED">Reported</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
                <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4a5d56] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#4a5d56] px-1">
              <span>Submitted Issues ({issues.length})</span>
            </div>

            {issues.length === 0 ? (
              <div className="rounded-xl bg-white p-8 border border-[#e2e8e4] text-center">
                <p className="text-xs text-[#4a5d56]">
                  {issues.length === 0 ?
                    "No issues reported yet" :
                    "No issues match your fliter criteria."
                  }
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }}
                  className="mt-2 text-xs font-semibold text-[#153b35] underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="rounded-xl bg-white p-4 sm:p-5 border border-[#e2e8e4] shadow-[0_1px_3px_0_rgba(21,59,53,0.04)] transition-all hover:border-[#b8d9cb]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono text-[#4a5d56] bg-[#f7f6f0] px-1.5 py-0.5 rounded border border-[#e2e8e4]">
                            {issue.id}
                          </span>
                          <CategoryBadge category={issue.category} size="sm" />
                          <StatusBadge status={issue.status} size="sm" />
                        </div>

                        <h2 className="text-sm font-bold text-[#153b35] leading-snug">
                          {issue.title}
                        </h2>

                        <p className="text-xs text-[#4a5d56] line-clamp-2 leading-relaxed">
                          {issue.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-[#4a5d56]">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#e7a84b]" />
                            {issue.location}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#153b35]" />
                            {new Date(issue.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="sm:self-center shrink-0 pt-2 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => setSelectedIssue(issue)}
                          className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold text-[#153b35] bg-[#f7f6f0] hover:bg-[#dcece5] rounded-lg border border-[#e2e8e4] transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">

                  <button
                    onClick={() => setPage(prev => prev - 1)}
                    disabled={page === 1}
                    className="w-full rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                  >
                    Previous
                  </button>

                  <span className="text-sm font-medium text-gray-600">
                    Page {pagination?.page ?? page} of {pagination?.totalPages ?? 1}
                  </span>

                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={!pagination || page >= pagination.totalPages}
                    className="w-full rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                  >
                    Next
                  </button>

                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
