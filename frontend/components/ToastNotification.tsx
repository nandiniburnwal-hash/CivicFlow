'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  onClose: () => void;
}

export function ToastNotification({
  type = 'success',
  title,
  message,
  onClose,
}: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#153b35]" />,
    info: <Info className="w-5 h-5 text-[#153b35]" />,
    warning: <AlertCircle className="w-5 h-5 text-[#e7a84b]" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
  };

  const borders = {
    success: 'border-[#b8d9cb] bg-white text-[#153b35]',
    info: 'border-[#dcece5] bg-white text-[#153b35]',
    warning: 'border-[#fae5c3] bg-white text-[#153b35]',
    error: 'border-red-200 bg-white text-[#153b35]',
  };

  return (
    <div
      role="alert"
      className={`fixed bottom-5 right-5 z-50 flex items-start gap-3 rounded-xl border p-4 shadow-lg ${borders[type]} max-w-sm w-full animate-in slide-in-from-bottom-3 duration-200`}
    >
      <div className="shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#153b35]">{title}</p>
        {message && <p className="mt-0.5 text-xs text-[#4a5d56]">{message}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-lg p-1 text-[#4a5d56] hover:text-[#153b35] hover:bg-[#dcece5]/40 transition-colors"
      >
        <span className="sr-only">Close notification</span>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

