
import React from 'react';
import {
  Car,
  Trash2,
  Droplets,
  Lightbulb,
  Trees,
  TrafficCone,
  Waves,
  Layers,
} from 'lucide-react';

interface CategoryBadgeProps {
  category?: string | null;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const normalizedCategory = (category ?? '').toLowerCase();

  const getIcon = () => {
    if (normalizedCategory.includes('road') || normalizedCategory.includes('pothole'))
      return <Car className="w-3.5 h-3.5 text-[#153b35]" />;

    if (normalizedCategory.includes('sanitation') || normalizedCategory.includes('waste'))
      return <Trash2 className="w-3.5 h-3.5 text-[#153b35]" />;

    if (normalizedCategory.includes('water') || normalizedCategory.includes('leak'))
      return <Droplets className="w-3.5 h-3.5 text-[#153b35]" />;

    if (normalizedCategory.includes('light') || normalizedCategory.includes('power'))
      return <Lightbulb className="w-3.5 h-3.5 text-[#153b35]" />;

    if (normalizedCategory.includes('park') || normalizedCategory.includes('green'))
      return <Trees className="w-3.5 h-3.5 text-[#153b35]" />;

    if (normalizedCategory.includes('traffic') || normalizedCategory.includes('sign'))
      return <TrafficCone className="w-3.5 h-3.5 text-[#153b35]" />;

    if (normalizedCategory.includes('drain') || normalizedCategory.includes('flood'))
      return <Waves className="w-3.5 h-3.5 text-[#153b35]" />;

    return <Layers className="w-3.5 h-3.5 text-[#153b35]" />;
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md bg-[#dcece5]/40 text-[#153b35] font-medium border border-[#dcece5] ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs'
      }`}
    >
      {getIcon()}
      <span className="truncate max-w-[150px]">
        {category?.trim() || 'Uncategorized'}
      </span>
    </span>
  );
}
