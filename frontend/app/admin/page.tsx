
'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { StatusBadge } from '@/components/StatusBadge';
import { CategoryBadge } from '@/components/CategoryBadge';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { ToastNotification } from '@/components/ToastNotification';
import { Issue, IssueStatus } from '@/lib/types';
import {
  Search,
  Filter,
  SlidersHorizontal,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [issuesError, setIssuesError] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [toast, setToast] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalIssues, setTotalIssues] = useState(0);

  const ITEMS_PER_PAGE = 5;

  const router = useRouter();


  // 2. Fetch all issues when the Admin dashboard loads
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setIsLoading(true);
        setIssuesError('');
        const token = localStorage.getItem('access_token');

        // Check whether the user is logged in
        if (!token) {
          router.push('/login');
          return;
        }

        // Decode JWT to check the user's role
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload.role !== 'ADMIN') {
          router.push('/dashboard');
          return;
        }
        
        //Build query params
        const params=new URLSearchParams({
          page: String(currentPage),
          limit:String(ITEMS_PER_PAGE),
        });

        //Add search only when the search box is not empty
        if(searchQuery.trim()){
          params.set('search', searchQuery.trim());
        }

        //Add status only when a specific status is selected
        if(statusFilter!=='ALL'){
          params.set('status', statusFilter);
        }

        // Fetch issues from the NestJS backend
        const response = await fetch(
          `http://localhost:3001/issues?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch issues: ${response.status}`);
        }

        const data = await response.json();


        if (!Array.isArray(data.data)) {
          throw new Error('Unexpected response format from server');
        }

        setIssues(data.data);
        setTotalPages(data.meta.totalPages);
        setTotalIssues(data.meta.totalIssues);
      } catch (error) {
        console.error('Error fetching issues:', error);
        setIssuesError('Unable to load issues. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, [router, currentPage, searchQuery, statusFilter]);




  // 3. Handle status changes in the frontend (temporary)
  const handleStatusChange = async (
    issueId: string,
    newStatus: IssueStatus
  ) => {
    try {

      //Access the token 
      const token = localStorage.getItem('access_token');

      if (!token) {
        router.push('/login');
        return;
      }

      //Send PATCH request
      const response = await fetch(
        `http://localhost:3001/issues/${issueId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      //Handle errors while taking response
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.message || 'Unable to update issue status.'
        );
      }

      //Receive the updated issue 
      const updatedIssue: Issue = await response.json();

      //Map through the issues and find the issue having the same id as issueId.
      //When we get the issue, change its status
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === issueId ? updatedIssue : issue
        ))
      setSelectedIssue(updatedIssue);

      setToast({
        title: 'Status Updated',
        message: `Issue status changed to ${updatedIssue.status.replace('_', ' ')}.`,
      });
    } catch (error) {
      console.log("Status update failed", error);
      setToast({
        title: "Update Failed",
        message: error instanceof Error ? error.message : 'Somethign went wrong while updating the status'
      })
    }
  }

  const handleAssignIssue = async (
    issueId: string,
    officerId: string
  ) => {
    try {

      setIsAssigning(true);
      const token = localStorage.getItem('access_token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        `http://localhost:3001/issues/${issueId}/assign`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            officerId: officerId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          Array.isArray(errorData?.message) ?
            errorData.message.join(', ') :
            errorData?.message || 'Unable to assign issue.'
        );
      }

      const updatedIssue: Issue = await response.json();

      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === issueId
            ? { ...issue, ...updatedIssue }
            : issue
        )
      );

      setSelectedIssue((prevIssue) =>
        prevIssue?.id === issueId
          ? { ...prevIssue, ...updatedIssue }
          : prevIssue
      );

      setToast({
        title: 'Officer Assigned',
        message: 'The issue has been successfully assigned.',
      });
    } catch (error) {
      console.error('Officer assignment failed:', error);

      setToast({
        title: 'Assignment Failed',
        message: error instanceof Error
          ? error.message
          : 'Something went wrong while assigning the officer.',
      });
    } finally {
      setIsAssigning(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6f0] text-[#153b35]">
      <Navbar />

      {toast && (
        <ToastNotification
          title={toast.title}
          message={toast.message}
          type="info"
          onClose={() => setToast(null)}
        />
      )}

      {/* Detail & Manage Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        isAdmin={true}
        onStatusChange={handleStatusChange}
        onAssignIssue={handleAssignIssue}
        isAssigning={isAssigning}
      />

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        <Sidebar variant="admin" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8e4]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider text-[#153b35] bg-[#dcece5] mb-2 border border-[#b8d9cb]">
                <span>Municipal Portal</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#153b35]">
                Issue Management Console
              </h1>

              <p className="mt-1 text-xs text-[#4a5d56]">
                Review reported municipal hazards, update operational statuses, and supervise resolutions.
              </p>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5d56]" />

              <input
                type="text"
                placeholder="Search issues by title, location, or description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
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
                    setCurrentPage(1);
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

          {/* Issue Management Table */}
          <div className="rounded-xl bg-white border border-[#e2e8e4] shadow-[0_1px_3px_0_rgba(21,59,53,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#e2e8e4] bg-[#f7f6f0]/70 text-[#4a5d56] font-semibold uppercase tracking-wider text-[11px]">
                    <th scope="col" className="py-3 px-4">ID</th>
                    <th scope="col" className="py-3 px-4">Title & Category</th>
                    <th scope="col" className="py-3 px-4 hidden md:table-cell">Location</th>
                    <th scope="col" className="py-3 px-4 hidden sm:table-cell">Reported Date</th>
                    <th scope="col" className="py-3 px-4">Status</th>
                    <th scope="col" className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#e2e8e4]">

                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center">
                        Loading issues...
                      </td>
                    </tr>
                  ) : issuesError ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-red-600">
                        {issuesError}
                      </td>
                    </tr>
                  ) : issues.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#4a5d56]">
                        No issues found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    issues.map((issue) => (
                      <tr
                        key={issue.id}
                        className="hover:bg-[#f7f6f0]/50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-medium text-[#4a5d56]">
                          {issue.id}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                          <div className="font-semibold text-[#153b35] truncate">
                            {issue.title}
                          </div>

                          <div className="mt-1">
                            <CategoryBadge category={issue.category} size="sm" />
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-[#4a5d56] hidden md:table-cell truncate max-w-[200px]">
                          {issue.location}
                        </td>

                        <td className="py-3.5 px-4 text-[#4a5d56] hidden sm:table-cell whitespace-nowrap">
                          {new Date(issue.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={issue.status} size="sm" />
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedIssue(issue)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#153b35] bg-[#f7f6f0] hover:bg-[#dcece5] rounded-lg border border-[#e2e8e4] transition-colors"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span>Manage</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}

                </tbody>
              </table>
            </div>

            {/* Record Count */}
            {/* Pagination Controls */}

            <div className="p-3 border-t border-[#e2e8e4] bg-[#f7f6f0]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#4a5d56]">


              <div className="flex items-center gap-2">

                <button
                  type="button"
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-3 py-1.5 rounded-lg border border-[#e2e8e4] bg-white text-[#153b35] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#dcece5]"
                >
                  Previous
                </button>

                <span className="font-semibold">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages || isLoading}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-3 py-1.5 rounded-lg border border-[#e2e8e4] bg-white text-[#153b35] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#dcece5]"
                >
                  Next
                </button>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
