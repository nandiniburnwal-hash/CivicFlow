
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Issue, IssueStatus } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { StatusBadge } from '@/components/StatusBadge';
import { CategoryBadge } from '@/components/CategoryBadge';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { ToastNotification } from '@/components/ToastNotification';
import {
    Search,
    Filter,
    SlidersHorizontal,
    ClipboardList,
    Clock,
    CheckCircle2,
    AlertCircle,
    MapPin,
    CalendarDays,
    UserRound,
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';


export default function OfficerDashboardPage() {
    const [issues, setIssues] = useState<Issue[]>
        ([]);
    const [isLoading, setIsLoading] = useState(true);
    const [issuesError, setIssuesError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

    //below one stores success or error notification
    const [toast, setToast] = useState<{
        title: string;
        message: string;
    } | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalIssues, setTotalIssues] = useState(0);
    const [totalAssignedIssues, setTotalAssignedIssues] = useState(0);
    const [totalInProgressIssues, setTotalInProgressIssues] = useState(0);
    const [totalResolvedIssues, setTotalResolvedIssues] = useState(0);
    const [totalUserIssues, setTotalUserIssues] = useState(0);

    const ITEMS_PER_PAGE = 5;

    const router = useRouter();

    useEffect(() => {
        const fetchAssignedIssues = async () => {
            try {

                setIsLoading(true);
                setIssuesError('');
                const token = localStorage.getItem('access_token');

                if (!token) {
                    router.push('/login');
                    return;
                }

                const payload = JSON.parse(atob(token.split('.')[1]));

                if (payload.role !== 'OFFICER') {
                    router.push('/dashboard');
                    return;
                }

                const params = new URLSearchParams({
                    page: String(currentPage),
                    limit: String(ITEMS_PER_PAGE),
                })

                if (searchQuery.trim()) {
                    params.set('search', searchQuery.trim());
                }

                if (statusFilter != 'ALL') {
                    params.set('status', statusFilter);
                }

                const response = await fetch(
                    `${API_BASE_URL}/issues?${params.toString()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) throw new Error(`Failed to fetch issues ${response.status}`);

                const data = await response.json();

                if (!Array.isArray(data.data)) throw new Error("Unexpected response format ffrom server");

                setIssues(data.data);
                setTotalIssues(data.meta.totalIssues);
                setTotalPages(data.meta.totalPages);

                setTotalUserIssues(data.meta.totalUserIssues);
                setTotalAssignedIssues(data.meta.totalAssignedIssues);
                setTotalInProgressIssues(data.meta.totalInProgressIssues);
                setTotalResolvedIssues(data.meta.totalResolvedIssues);
            } catch (error) {
                console.error("Error:", error);
                setIssuesError(
                    error instanceof Error ?
                        error.message
                        : "unable to load the issues."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignedIssues();
    }, [router, currentPage, searchQuery, statusFilter]);


    const handleStatusChange = async (
        issueId: string,
        newStatus: IssueStatus
    ) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/issues/${issueId}/status`,
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

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message || 'Unable to update the issue status.'
                );
            }

            const updatedIssue: Issue = await response.json();

            //Update the issue in dashboard
            setIssues((prevIssues) =>
                prevIssues.map((issue) =>
                    issue.id === issueId
                        ? { ...issue, ...updatedIssue }
                        : issue
                )
            );

            //Update the currently selected issue
            setSelectedIssue((prevIssue) =>
                prevIssue?.id === issueId
                    ? { ...prevIssue, ...updatedIssue }
                    : prevIssue
            );

            setToast({
                title: 'Status Updated',
                message: `Issue status changed to ${updatedIssue.status.replace('_', ' ')}.`,
            });
        } catch (error) {
            console.error('Status update failed', error);
            setToast({
                title: 'Update Failed',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Something went wrong. Could not update the status.'
            });
        }
    };

    const stats = [
        {
            title: 'Assigned Issues',
            value: 	totalUserIssues,
            description: 'Total issues assigned to you',
            icon: ClipboardList,
            color: 'text-[#153b35]',
            bg: 'bg-[#dcece5]',
        },
        {
            title: 'Awaiting Action',
            value: totalAssignedIssues,
            description: 'Issues requiring attention',
            icon: AlertCircle,
            color: 'text-amber-700',
            bg: 'bg-amber-50',
        },
        {
            title: 'In Progress',
            value: totalInProgressIssues,
            description: 'Currently being worked on',
            icon: Clock,
            color: 'text-blue-700',
            bg: 'bg-blue-50',
        },
        {
            title: 'Resolved',
            value: totalResolvedIssues,
            description: 'Successfully completed',
            icon: CheckCircle2,
            color: 'text-emerald-700',
            bg: 'bg-emerald-50',
        },
    ];

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

            <IssueDetailModal
                issue={selectedIssue}
                onClose={() => setSelectedIssue(null)}
                isOfficer={true}
                onStatusChange={handleStatusChange}
            />

            <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
                <Sidebar variant="officer" />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">

                    {/* Dashboard Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8e4]">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider text-[#153b35] bg-[#dcece5] mb-2 border border-[#b8d9cb]">
                                <span>Municipal Officer Portal</span>
                            </div>

                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#153b35]">
                                Officer Dashboard
                            </h1>

                            <p className="mt-1 text-xs text-[#4a5d56]">
                                Manage your assigned civic issues, track progress, and update resolutions.
                            </p>
                        </div>
                    </div>

                    {/* Officer Profile Summary */}
                    <div className="rounded-xl bg-white border border-[#e2e8e4] p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(21,59,53,0.04)]">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-[#dcece5] flex items-center justify-center">
                                <UserRound className="w-5 h-5 text-[#153b35]" />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold text-[#153b35]">
                                    Welcome, Officer
                                </h2>
                                <p className="text-xs text-[#4a5d56] mt-0.5">
                                    Municipal Issue Management Team
                                </p>
                            </div>
                        </div>

                        {/* TODO: Display the actual logged-in officer's name and details from JWT/profile API. */}
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {stats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={stat.title}
                                    className="rounded-xl bg-white border border-[#e2e8e4] p-4 shadow-[0_1px_3px_0_rgba(21,59,53,0.04)]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-[#4a5d56]">
                                                {stat.title}
                                            </p>

                                            <h3 className="text-2xl font-bold text-[#153b35] mt-2">
                                                {stat.value}
                                            </h3>
                                        </div>

                                        <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                                            <Icon className={`w-4 h-4 ${stat.color}`} />
                                        </div>
                                    </div>

                                    <p className="text-[11px] text-[#4a5d56] mt-3">
                                        {stat.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Assigned Issues Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h2 className="text-base font-bold text-[#153b35]">
                                My Assigned Issues
                            </h2>

                            <p className="text-xs text-[#4a5d56] mt-1">
                                Review and manage civic issues assigned to you.
                            </p>
                        </div>
                    </div>

                    {/* Search and Status Filters */}
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

                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full sm:w-auto pl-3 pr-8 py-2 text-xs rounded-lg border border-[#e2e8e4] bg-white text-[#153b35] focus:outline-none focus:border-[#153b35] appearance-none"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="ASSIGNED">Assigned</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                            </select>

                            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4a5d56] pointer-events-none" />
                        </div>
                    </div>

                    {/* Assigned Issues Table */}
                    <div className="rounded-xl bg-white border border-[#e2e8e4] shadow-[0_1px_3px_0_rgba(21,59,53,0.04)] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-[#e2e8e4] bg-[#f7f6f0]/70 text-[#4a5d56] font-semibold uppercase tracking-wider text-[11px]">
                                        <th scope="col" className="py-3 px-4">Issue ID</th>
                                        <th scope="col" className="py-3 px-4">Issue Details</th>
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
                                                Loading assigned issues...
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
                                            <td colSpan={6} className="py-10 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <ClipboardList className="w-8 h-8 text-[#9aaba3]" />

                                                    <p className="font-semibold text-[#153b35]">
                                                        No assigned issues found
                                                    </p>

                                                    <p className="text-[#4a5d56]">
                                                        Assigned issues will appear here.
                                                    </p>
                                                </div>
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

                                                <td className="py-3.5 px-4 text-[#4a5d56] hidden md:table-cell">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                                                        {issue.location}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 text-[#4a5d56] hidden sm:table-cell whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <CalendarDays className="w-3.5 h-3.5" />
                                                        {new Date(issue.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <StatusBadge status={issue.status} size="sm" />
                                                </td>

                                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#011512] bg-[#f7f6f0] hover:bg-[#153b35] hover:text-white rounded-lg border border-[#e2e8e4] transition-colors"
                                                        onClick={() => setSelectedIssue(issue)}

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
