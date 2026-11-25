'use client';

import React, { useEffect, useState } from 'react';
import { Issue, IssueStatus } from '@/lib/types';
import { CategoryBadge } from './CategoryBadge';
import {
  X,
  MapPin,
  Calendar,
  User,
  Shield,
  Hash,
  Clock,
  CheckCircle2,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface Officer {
  id: string;
  name: string;
  email: string;
}

interface IssueDetailModalProps {
  issue: Issue | null;
  onClose: () => void;
  isAdmin?: boolean;
  isOfficer?: boolean;
  onStatusChange?: (issueId: string, newStatus: IssueStatus) => void;
  onAssignIssue?: (issueId: string, officerId: string) => Promise<void>;
  isAssigning?: boolean;
}

function ModalStatusBadge({ status }: { status: IssueStatus }) {
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
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}

export function IssueDetailModal({
  issue,
  onClose,
  isAdmin = false,
  isOfficer = false,
  onStatusChange,
  onAssignIssue,
  isAssigning = false,
}: IssueDetailModalProps) {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [loadingOfficers, setLoadingOfficers] = useState(false);
  const [officerError, setOfficerError] = useState('');

  useEffect(() => {
    if (!issue) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [issue, onClose]);

  useEffect(() => {
    if (!isAdmin || !issue) return;

    const fetchOfficers = async () => {
      try {
        setLoadingOfficers(true);
        setOfficerError('');

        const token = localStorage.getItem('access_token');

        if (!token) throw new Error('Authentication not found');

        const response = await fetch(`${API_BASE_URL}/users/officers`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch officers');

        const data: Officer[] = await response.json();

        setOfficers(data);
        setSelectedOfficerId(issue.assignedToId ?? '');
      } catch (error) {
        console.error('Officer fetching error: ', error);

        setOfficerError(
          error instanceof Error ? error.message : 'Something went wrong.'
        );
      } finally {
        setLoadingOfficers(false);
      }
    };

    fetchOfficers();
  }, [isAdmin, issue?.id, issue?.assignedToId]);

  const handleAssign = async () => {
    if (!selectedOfficerId || !issue || !onAssignIssue) return;
    await onAssignIssue(issue.id, selectedOfficerId);
  };

  if (!issue) return null;

  const formattedDate = new Date(issue.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Here we check if its officer, then if issue is "assigned" change it to "in progress", if "in progress" change it to "resolved", o/w no further action (for reported & resolved)
  const statuses: IssueStatus[] = isOfficer
    ? issue.status === 'ASSIGNED'
      ? ['IN_PROGRESS']
      : issue.status === 'IN_PROGRESS'
        ? ['RESOLVED']
        : []
    : ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17365D]/45"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm bg-[#FFFFFF] border border-[#D5DCE4] border-t-4 border-t-[#17365D] shadow-lg text-[#25364A]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#D5DCE4] bg-[#FFFFFF] px-6 py-4">
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#17365D]">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-[#E9A23B]"
                  aria-hidden="true"
                />
                <span>Issue Details</span>
              </span>
              <ModalStatusBadge status={issue.status} />
            </div>

            <h2
              id="modal-headline"
              className="text-lg font-bold tracking-tight text-[#17365D] leading-snug"
            >
              {issue.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close issue details modal"
            className="rounded-sm border border-[#D5DCE4] bg-[#FFFFFF] p-1.5 text-[#4A5B6E] hover:bg-[#F3F5F7] hover:text-[#17365D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D] transition-colors shrink-0"
          >
            <X className="w-4.5 h-4.5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Structured Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Reference ID */}
            <div className="flex items-start gap-2.5 rounded-sm border border-[#D5DCE4] bg-[#F8FAFC] p-3">
              <Hash
                className="w-4 h-4 text-[#17365D] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A5B6E]">
                  Reference ID
                </p>
                <p className="mt-0.5 font-mono text-xs font-semibold text-[#17365D] break-all">
                  {issue.id}
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-start gap-2.5 rounded-sm border border-[#D5DCE4] bg-[#F8FAFC] p-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A5B6E] mb-1">
                  Category
                </p>
                <CategoryBadge category={issue.category} />
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2.5 rounded-sm border border-[#D5DCE4] bg-[#FFFFFF] p-3">
              <MapPin
                className="w-4 h-4 text-[#E9A23B] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A5B6E]">
                  Location
                </p>
                <p className="mt-0.5 text-xs sm:text-sm font-medium text-[#25364A]">
                  {issue.location}
                </p>
              </div>
            </div>

            {/* Date Reported */}
            <div className="flex items-start gap-2.5 rounded-sm border border-[#D5DCE4] bg-[#FFFFFF] p-3">
              <Calendar
                className="w-4 h-4 text-[#17365D] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A5B6E]">
                  Date Reported
                </p>
                <p className="mt-0.5 text-xs sm:text-sm font-medium text-[#25364A]">
                  {formattedDate}
                </p>
              </div>
            </div>

            {/* Reported By */}
            <div className="flex items-start gap-2.5 rounded-sm border border-[#D5DCE4] bg-[#FFFFFF] p-3 sm:col-span-2">
              <User
                className="w-4 h-4 text-[#17365D] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A5B6E]">
                  Reported By
                </p>
                <p className="mt-0.5 text-xs sm:text-sm font-medium text-[#25364A]">
                  {issue.user?.name
                    ? `${issue.user.name} (${issue.user.email})`
                    : 'Citizen User'}
                </p>
              </div>
            </div>

            {/* Assigned Officer (if present on issue) */}
            {issue.assignedTo && (
              <div className="flex items-start gap-2.5 rounded-sm border border-[#D5DCE4] bg-[#FFFFFF] p-3 sm:col-span-2">
                <UserCheck
                  className="w-4 h-4 text-[#287A48] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A5B6E]">
                    Assigned Officer
                  </p>
                  <p className="mt-0.5 text-xs sm:text-sm font-medium text-[#25364A]">
                    {issue.assignedTo.name} ({issue.assignedTo.email})
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Full-Width Description */}
          <div className="rounded-sm bg-[#F8FAFC] p-4 border border-[#D5DCE4]">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#17365D] mb-1.5">
              Description
            </h3>
            <p className="text-sm text-[#25364A] whitespace-pre-line leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Admin / Officer Status Action */}
          {(isAdmin || isOfficer) && onStatusChange && (
            <div className="rounded-sm border border-[#D5DCE4] border-l-4 border-l-[#17365D] bg-[#F8FAFC] p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Shield
                  className="w-4 h-4 text-[#17365D]"
                  aria-hidden="true"
                />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#17365D]">
                  {isOfficer ? 'Update Issue Progress' : 'Status Management'}
                </h4>
              </div>

              <p className="text-xs text-[#4A5B6E] mb-3">
                {isOfficer
                  ? 'Update the progress of the issue assigned to you.'
                  : 'Update the issue status as it progresses through the resolution workflow.'}
              </p>

              {statuses.length > 0 ? (
                <div
                  className={
                    isOfficer
                      ? 'flex flex-wrap gap-2'
                      : 'grid grid-cols-2 sm:grid-cols-4 gap-2'
                  }
                >
                  {statuses.map((st) => {
                    const isActive = issue.status === st;

                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => onStatusChange(issue.id, st)}
                        className={`
                          ${
                            isOfficer
                              ? 'inline-flex w-fit min-w-max shrink-0 whitespace-nowrap px-4 py-2.5 text-sm'
                              : 'w-full px-3 py-2.5 text-xs'
                          }
                          font-semibold rounded-sm border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D]
                          ${
                            isOfficer || isActive
                              ? 'bg-[#17365D] text-[#FFFFFF] border-[#17365D] hover:bg-[#102845]'
                              : 'bg-[#FFFFFF] text-[#17365D] border-[#D5DCE4] hover:bg-[#EDF2F7]'
                          }
                        `}
                      >
                        {isOfficer ? 'Mark as ' : ''}
                        {st.replace('_', ' ')}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs font-semibold text-[#287A48]">
                  {issue.status === 'RESOLVED'
                    ? 'This issue has been successfully resolved.'
                    : 'This issue is not available for officer status updates.'}
                </p>
              )}
            </div>
          )}

          {/* Admin Officer Assignment */}
          {isAdmin && onAssignIssue && (
            <div className="rounded-sm border border-[#D5DCE4] border-l-4 border-l-[#287A48] bg-[#F8FAFC] p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <User
                  className="w-4 h-4 text-[#17365D]"
                  aria-hidden="true"
                />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#17365D]">
                  Officer Assignment
                </h4>
              </div>

              <p className="text-xs text-[#4A5B6E] mb-3">
                Assign this issue to an officer responsible for resolving it.
              </p>

              {loadingOfficers ? (
                <p className="text-xs text-[#4A5B6E]">Loading officers...</p>
              ) : officerError ? (
                <p className="text-xs text-[#B91C1C]">{officerError}</p>
              ) : officers.length === 0 ? (
                <p className="text-xs text-[#4A5B6E]">
                  No officers are currently registered.
                </p>
              ) : (
                <>
                  <select
                    aria-label="Select officer"
                    value={selectedOfficerId}
                    onChange={(e) => setSelectedOfficerId(e.target.value)}
                    className="w-full rounded-sm border border-[#CBD5E1] bg-[#FFFFFF] px-3 py-2 text-xs sm:text-sm text-[#25364A] mb-3 focus:border-[#17365D] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#17365D]"
                    disabled={isAssigning}
                  >
                    <option value="">Select an officer</option>

                    {officers.map((officer) => (
                      <option key={officer.id} value={officer.id}>
                        {officer.name} ({officer.email})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleAssign}
                    disabled={!selectedOfficerId || isAssigning}
                    className="w-full rounded-sm bg-[#287A48] px-4 py-2 text-xs sm:text-sm font-semibold text-[#FFFFFF] transition-colors hover:bg-[#1F6139] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#287A48] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isAssigning ? 'Assigning...' : 'Assign Officer'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
