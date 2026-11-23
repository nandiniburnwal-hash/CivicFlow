import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  badge?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  badge,
}: StatCardProps) {
  return (
    <div className="relative rounded-xl bg-white p-5 border border-[#e2e8e4] shadow-[0_1px_3px_0_rgba(21,59,53,0.04)] transition-all hover:border-[#b8d9cb]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#4a5d56]">
          {title}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dcece5]/60 text-[#153b35]">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-[#153b35] sm:text-3xl">
          {value}
        </span>
        {badge && (
          <span className="inline-flex items-center rounded-full bg-[#dcece5] px-2 py-0.5 text-[11px] font-medium text-[#153b35]">
            {badge}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1 text-xs text-[#4a5d56]">{description}</p>
      )}
    </div>
  );
}

