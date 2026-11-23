import React from 'react';
import { IssueStatus } from '@/lib/types';
import { Clock, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: IssueStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const configs: Record<
    IssueStatus,
    { label: string; bg: string; text: string; border: string; dot: string; icon: React.ReactNode }
  > = {
    REPORTED: {
      label: 'Reported',
      bg: 'bg-[#fef8ed]',
      text: 'text-[#9c6a1e]',
      border: 'border-[#fae5c3]',
      dot: 'bg-[#e7a84b]',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    ASSIGNED: {
      label: 'Assigned',
      bg: 'bg-[#f0f7f4]',
      text: 'text-[#153b35]',
      border: 'border-[#cbe4d8]',
      dot: 'bg-[#3b7364]',
      icon: <UserCheck className="w-3.5 h-3.5" />,
    },
    IN_PROGRESS: {
      label: 'In Progress',
      bg: 'bg-[#eaf4ef]',
      text: 'text-[#153b35]',
      border: 'border-[#bddfcf]',
      dot: 'bg-[#e7a84b]',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    RESOLVED: {
      label: 'Resolved',
      bg: 'bg-[#dcece5]',
      text: 'text-[#153b35]',
      border: 'border-[#b8d8cb]',
      dot: 'bg-[#153b35]',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
  };

  const config = configs[status] || configs.REPORTED;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-0.5 text-xs font-medium gap-1.5',
    lg: 'px-3 py-1 text-sm font-medium gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} transition-colors`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && <span className="opacity-80">{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  );
}

