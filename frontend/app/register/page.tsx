'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Landmark,
  ArrowLeft,
  UserPlus,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { ToastNotification } from '@/components/ToastNotification';
import { API_BASE_URL } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setToast(null);

    if (password !== confirmPassword) {
      setFieldErrors({
        confirmPassword: 'Passwords do not match. Please re-enter.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // fetch() sends a request to your NestJS backend
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST', // POST tells backend we're submitting data
        headers: {
          'Content-Type': 'application/json', // tells NestJS that request body is of JSON type
        },
        body: JSON.stringify({
          // stringify converts the JS obj into JSON text
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const messages: string[] = Array.isArray(data.message)
          ? data.message
          : [data.message || 'Registration failed. Please try again.'];

        const errors: {
          name?: string;
          email?: string;
          password?: string;
        } = {};

        messages.forEach((message: string) => {
          const msg = message.toLowerCase();

          if (msg.includes('name')) {
            errors.name = message;
          } else if (
            msg.includes('email') ||
            msg.includes('already registered') ||
            msg.includes('already exists')
          ) {
            errors.email = message;
          } else if (msg.includes('password')) {
            errors.password = message;
          }
        });

        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
        } else {
          setToast({
            title: 'Registration failed',
            message: messages.join(' '),
            type: 'error',
          });
        }

        return;
      }

      setToast({
        title: 'Registration Successful',
        message:
          'Your account has been created successfully. You can now log in.',
        type: 'success',
      });

      // After successful registration, user sees the success message for 1 sec then is redirected to /login
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error) {
      setToast({
        title: 'Registration Failed',
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong, please try again later.',
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
      <main className="flex-1 flex flex-col justify-center px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          {/* Registration Form Panel */}
          <div className="bg-[#FFFFFF] border border-[#D5DCE4] border-t-4 border-t-[#17365D] rounded-sm shadow-[0_1px_2px_rgba(23,54,93,0.06)]">
            {/* Panel Header */}
            <div className="px-6 py-3.5 border-b border-[#E6ECF2]">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-[#E9A23B]"
                  aria-hidden="true"
                />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#17365D]">
                  New Citizen Enrollment
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17365D]">
                Citizen Registration
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#4A5B6E] leading-snug">
                A citizen account is required to submit civic issue reports and
                track their resolution progress.
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-[#17365D] mb-1"
                >
                  Full Name <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Enter your full name"
                  aria-invalid={Boolean(fieldErrors.name)}
                  className={`w-full rounded-sm border ${
                    fieldErrors.name
                      ? 'border-[#B91C1C] focus:border-[#B91C1C]'
                      : 'border-[#CBD5E1] focus:border-[#17365D]'
                  } bg-[#FFFFFF] px-3.5 py-2 text-sm text-[#25364A] placeholder:text-[#64748B] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#17365D] transition-colors`}
                />
                {fieldErrors.name && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-[#B91C1C]">
                    <AlertCircle
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{fieldErrors.name}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-[#17365D] mb-1"
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
                  <p className="mt-1 flex items-center gap-1 text-xs text-[#B91C1C]">
                    <AlertCircle
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-[#17365D] mb-1"
                >
                  Password <span className="text-[#B91C1C]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFieldErrors((prev) => ({
                        ...prev,
                        password: undefined,
                        confirmPassword: undefined,
                      }));
                    }}
                    placeholder="Minimum 8 characters"
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
                {fieldErrors.password ? (
                  <p className="mt-1 flex items-center gap-1 text-xs text-[#B91C1C]">
                    <AlertCircle
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{fieldErrors.password}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-[#4A5B6E]">
                    Must be at least 8 characters long.
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-[#17365D] mb-1"
                >
                  Confirm Password <span className="text-[#B91C1C]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setFieldErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                    }}
                    placeholder="Re-enter your password"
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                    className={`w-full rounded-sm border ${
                      fieldErrors.confirmPassword
                        ? 'border-[#B91C1C] focus:border-[#B91C1C]'
                        : 'border-[#CBD5E1] focus:border-[#17365D]'
                    } bg-[#FFFFFF] pl-3.5 pr-10 py-2 text-sm text-[#25364A] placeholder:text-[#64748B] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#17365D] transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-[#4A5B6E] hover:text-[#17365D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-[#B91C1C]">
                    <AlertCircle
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{fieldErrors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-sm bg-[#17365D] px-4 py-2.5 text-sm font-semibold text-[#FFFFFF] hover:bg-[#102845] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D] focus-visible:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                <span>
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </span>
              </button>
            </form>

            {/* Panel Footer Links */}
            <div className="bg-[#F8FAFC] px-6 py-3 border-t border-[#E6ECF2] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <p className="text-[#25364A]">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-[#17365D] hover:underline"
                >
                  Log In
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
