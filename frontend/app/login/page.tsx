'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Landmark,
  ArrowLeft,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { ToastNotification } from '@/components/ToastNotification';
import { API_BASE_URL } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setToast(null);

    try {
      // Sends email & password to NestJS backend
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        const messages: string[] = Array.isArray(data.message)
          ? data.message
          : [data.message || 'Login Failed. Please try again.'];

        const errors: {
          email?: string;
          password?: string;
        } = {};

        messages.forEach((message: string) => {
          const msg = message.toLowerCase();

          if (msg.includes('please enter a valid email')) errors.email = message;
          else if (
            msg.includes('password is required') ||
            msg.includes('password must be a string')
          ) {
            errors.password = message;
          }
        });

        if (Object.keys(errors).length > 0) setFieldErrors(errors);
        else {
          setToast({
            title: 'Login Failed',
            message: messages.join(' '),
            type: 'error',
          });
        }

        return;
      }

      localStorage.setItem('access_token', data.access_token);

      const payload = JSON.parse(atob(data.access_token.split('.')[1]));

      const role = payload.role;

      setToast({
        title: 'Login Successful',
        message: 'Redirecting to your dashboard...',
        type: 'success',
      });

      setTimeout(() => {
        if (role === 'ADMIN') {
          router.push('/admin');
        } else if (role === 'CITIZEN') {
          router.push('/dashboard');
        } else if (role === 'OFFICER') {
          router.push('/officer');
        } else {
          localStorage.removeItem('access_token');
          router.push('/login');
        }
      }, 1000);
    } catch (error) {
      // Displaying the error
      setToast({
        title: 'Login Failed',
        message:
          error instanceof TypeError
            ? 'Unable to connect to the server. Please try again.'
            : error instanceof Error
              ? error.message
              : 'Something went wrong. Please try again',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F5F7] text-[#25364A]">
      {toast && (
        <ToastNotification
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Subtle Top Civic Accent Strip */}
      <div className="h-1 w-full bg-[#17365D] border-b border-[#E9A23B] shrink-0" />

      {/* Portal Header */}
      <header className="w-full bg-[#FFFFFF] border-b border-[#D5DCE4] shrink-0">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#17365D] text-[#FFFFFF] border border-[#102845] shrink-0">
              <Landmark className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-[#17365D] leading-tight">
                CivicFlow
              </div>
              <p className="text-xs font-medium text-[#4A5B6E] leading-tight">
                Citizen Grievance Management Portal
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-sm border border-[#D5DCE4] bg-[#FFFFFF] px-3 py-1.5 text-xs sm:text-sm font-medium text-[#17365D] hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          {/* Login Form Panel */}
          <div className="bg-[#FFFFFF] border border-[#D5DCE4] border-t-4 border-t-[#17365D] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)]">
            {/* Panel Header */}
            <div className="px-6 py-4 border-b border-[#E6ECF2]">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-[#E9A23B]"
                  aria-hidden="true"
                />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#17365D]">
                  Citizen Account Access
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17365D]">
                Citizen Login
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#4A5B6E] leading-snug">
                Sign in to access your account and track your reported civic
                issues.
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-[#17365D] mb-1.5"
                >
                  Email Address <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="citizen@example.com"
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={`w-full rounded-sm border ${
                    fieldErrors.email
                      ? 'border-[#B91C1C] focus:border-[#B91C1C]'
                      : 'border-[#CBD5E1] focus:border-[#17365D]'
                  } bg-[#FFFFFF] px-3.5 py-2 text-sm text-[#25364A] placeholder:text-[#64748B] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#17365D] transition-colors`}
                />
                {fieldErrors.email && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-[#B91C1C]">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-[#17365D] mb-1.5"
                >
                  Password <span className="text-[#B91C1C]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFieldErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }}
                    placeholder="Enter your password"
                    aria-invalid={Boolean(fieldErrors.password)}
                    className={`w-full rounded-sm border ${
                      fieldErrors.password
                        ? 'border-[#B91C1C] focus:border-[#B91C1C]'
                        : 'border-[#CBD5E1] focus:border-[#17365D]'
                    } bg-[#FFFFFF] pl-3.5 pr-10 py-2 text-sm text-[#25364A] placeholder:text-[#64748B] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#17365D] transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-[#4A5B6E] hover:text-[#17365D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-[#B91C1C]">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{fieldErrors.password}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-[#17365D] px-4 py-2.5 text-sm font-semibold text-[#FFFFFF] hover:bg-[#102845] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D] focus-visible:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                <span>{isSubmitting ? 'Signing in...' : 'Login'}</span>
              </button>
            </form>

            {/* Panel Footer Links */}
            <div className="bg-[#F8FAFC] px-6 py-3.5 border-t border-[#E6ECF2] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <p className="text-[#25364A]">
                New to CivicFlow?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-[#287A48] hover:underline"
                >
                  Create an account.
                </Link>
              </p>
              <Link
                href="/"
                className="font-medium text-[#17365D] hover:underline"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Compact Portal Footer */}
      <footer className="w-full bg-[#17365D] text-[#FFFFFF] border-t-2 border-[#E9A23B] shrink-0">
        <div className="mx-auto max-w-6xl px-4 py-2.5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-xs">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-0.5">
            <span className="font-bold tracking-tight">CivicFlow</span>
            <span className="text-[#B8C7D9]" aria-hidden="true">
              |
            </span>
            <span className="text-[#E2E8F0]">
              Digital platform for citizen civic issue reporting and complaint
              tracking.
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
