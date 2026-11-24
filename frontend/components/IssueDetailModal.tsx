'use client';

import React, { useEffect, useState } from 'react';
import { Issue, IssueStatus } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import {
  X,
  MapPin,
  Calendar,
  User,
  Shield,
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
    if (!isAdmin || !issue) return;

    const fetchOfficers = async () => {
      try {
        setLoadingOfficers(true);
        setOfficerError('');

        const token = localStorage.getItem('access_token');

        if (!token) throw new Error('Authentication not found');

        const response = await fetch(
          `${API_BASE_URL}/users/officers`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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


  //Here we check if its officer, then if issue is "assigned" change it to "in progress", if "in progress" change it to "resolved", o/w no further action (for reported & resolved)
  const statuses: IssueStatus[] = isOfficer
    ? issue.status === 'ASSIGNED'
      ? ['IN_PROGRESS']
      : issue.status === 'IN_PROGRESS'
        ? ['RESOLVED']
        : []
    : ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#153b35]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl border border-[#e2e8e4]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e2e8e4] bg-white px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-medium text-[#4a5d56] bg-[#f7f6f0] px-2 py-0.5 rounded border border-[#e2e8e4]">
              {issue.id}
            </span>
            <StatusBadge status={issue.status} size="sm" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#4a5d56] hover:text-[#153b35] hover:bg-[#dcece5]/40 transition-colors"
          >
            <span className="sr-only">Close modal</span>
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Title & Category */}
          <div>
            <div className="mb-2">
              <CategoryBadge category={issue.category} />
            </div>
            <h2
              id="modal-headline"
              className="text-lg font-bold tracking-tight text-[#153b35] leading-snug"
            >
              {issue.title}
            </h2>
          </div>

          {/* Description */}
          <div className="rounded-lg bg-[#f7f6f0] p-4 border border-[#e2e8e4]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4a5d56] mb-1.5">
              Issue Description
            </h3>
            <p className="text-sm text-[#153b35] whitespace-pre-line leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2.5 rounded-lg border border-[#e2e8e4] p-3 bg-white">
              <MapPin className="w-4 h-4 text-[#e7a84b] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-[#4a5d56] font-medium uppercase tracking-wider">Location</p>
                <p className="text-xs font-semibold text-[#153b35] mt-0.5">
                  {issue.location}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-[#e2e8e4] p-3 bg-white">
              <Calendar className="w-4 h-4 text-[#153b35] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-[#4a5d56] font-medium uppercase tracking-wider">Reported On</p>
                <p className="text-xs font-semibold text-[#153b35] mt-0.5">
                  {formattedDate}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-[#e2e8e4] p-3 bg-white sm:col-span-2">
              <User className="w-4 h-4 text-[#153b35] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-[#4a5d56] font-medium uppercase tracking-wider">Reported By</p>
                <p className="text-xs font-semibold text-[#153b35] mt-0.5">
                  {issue.user?.name ? `${issue.user.name} (${issue.user.email})` : 'Citizen User'}
                </p>
              </div>
            </div>
          </div>

          
{/* Admin Status Action */}
{(isAdmin || isOfficer) && onStatusChange && (
  <div className="rounded-lg border border-[#dcece5] bg-[#f0f7f4] p-4">
    <div className="flex items-center gap-2 mb-2">
      <Shield className="w-4 h-4 text-[#153b35]" />
      <h4 className="text-xs font-bold uppercase tracking-wider text-[#153b35]">
        {isOfficer ? 'Update Issue Progress' : 'Status Management'}
      </h4>
    </div>

    <p className="text-xs text-[#4a5d56] mb-3">
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
                ${isOfficer
                  ? 'inline-flex w-fit min-w-max shrink-0 whitespace-nowrap px-5 py-3 text-sm'
                  : 'w-full px-3 py-3 text-xs'
                }
                font-semibold rounded-lg border transition-all
                ${
                  isOfficer || isActive
                    ? 'bg-[#153b35] text-white border-[#153b35] hover:bg-[#24594e]'
                    : 'bg-white text-[#153b35] border-[#e2e8e4] hover:bg-[#f0f7f4]'
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
      <p className="text-xs font-medium text-emerald-700">
        {issue.status === 'RESOLVED'
          ? 'This issue has been successfully resolved.'
          : 'This issue is not available for officer status updates.'}
      </p>
    )}
  </div>
)}


        {/* Admin Officer Assignment */}
        {isAdmin && onAssignIssue && (
          <div className="rounded-lg border border-[#dcece5] bg-[#f0f7f4] p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-[#153b35]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#153b35]">
                Officer Assignment
              </h4>
            </div>

            <p className="text-xs text-[#4a5d56] mb-3">
              Assign this issue to an officer responsible for resolving it.
            </p>

            {loadingOfficers ? (
              <p className="text-xs text-[#4a5d56]">Loading officers...</p>
            ) : officerError ? (
              <p className="text-xs text-red-600">{officerError}</p>
            ) : officers.length === 0 ? (
              <p className="text-xs text-[#4a5d56]">
                No officers are currently registered.
              </p>
            ) : (
              <>
                <select
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                  className="w-full rounded-lg border border-[#e2e8e4] bg-white px-3 py-2 text-xs text-[#153b35] mb-3"
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
                  className="w-full rounded-lg bg-[#153b35] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#24594e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAssigning ? 'Assigning...' : 'Assign Officer'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end border-t border-[#e2e8e4] px-6 py-3.5 bg-[#f7f6f0] rounded-b-xl">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 text-xs font-semibold text-[#153b35] bg-white border border-[#e2e8e4] hover:bg-[#dcece5]/30 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
    </div >
  );
}

