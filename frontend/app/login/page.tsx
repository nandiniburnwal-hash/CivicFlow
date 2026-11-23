'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, ArrowRight } from 'lucide-react';
import { ToastNotification } from '@/components/ToastNotification';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string,
    password?: string,
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setToast(null);

    try {

      //Sends email & password to NestJS backend
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {

        const messages: string[] = Array.isArray(data.message) ? data.message : [data.message || "Login Failed. Please try again."]


        const errors: {
          email?: string,
          password?: string,
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
            title: "Login Failed",
            message: messages.join(' '),
            type: 'error',
          });
        }

        return;
      }

      localStorage.setItem('access_token', data.access_token);

      const payload = JSON.parse(
        atob(data.access_token.split('.')[1])
      );

      const role = payload.role;
      console.log("Decoded role:", role);
      console.log("JWT payload:", payload);

      setToast({
        title: "Login Successful",
        message: "Loading citizen dashbaord..",
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

      //Displaying the error
      setToast({
        title: "Login Failed",
        message: error instanceof TypeError ? "Unable to connect to the server. Please try again." : error instanceof Error ? error.message : "Something went wrong. Please try again",
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#f7f6f0] py-12 px-4 sm:px-6 lg:px-8 text-[#153b35]">
      {toast && (
        <ToastNotification
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 group mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#153b35] text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#153b35]">
            Civic<span className="text-[#e7a84b]">Flow</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[#153b35]">
          Sign In to Civic Flow
        </h1>
        <p className="mt-1 text-xs text-[#4a5d56]">
          Enter your credentials to access your reports and civic submissions.
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-xl bg-white p-6 sm:p-8 border border-[#e2e8e4] shadow-[0_1px_3px_0_rgba(21,59,53,0.04)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#153b35] mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value),
                    setFieldErrors((prev) => ({ ...prev, email: undefined }))
                }}
                placeholder="citizen@example.com"

                className={`w-full rounded-lg border ${fieldErrors.email
                  ? 'border-red-500'
                  : 'border-[#e2e8e4]'
                  } bg-[#f7f6f0]/50 px-3.5 py-2.5 text-xs text-[#153b35] placeholder:text-[#4a5d56]/50 focus:bg-white focus:outline-none transition-colors`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-[#153b35]"
                >
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value),
                    setFieldErrors((prev) => ({ ...prev, password: undefined }))
                }}
                placeholder="••••••••"

                className={`w-full rounded-lg border ${fieldErrors.password
                  ? 'border-red-500'
                  : 'border-[#e2e8e4]'
                  } bg-[#f7f6f0]/50 px-3.5 py-2.5 text-xs text-[#153b35] placeholder:text-[#4a5d56]/50 focus:bg-white focus:outline-none transition-colors`}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#153b35] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1c4d45] focus:outline-none transition-colors disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Link to Register */}
          <div className="mt-6 pt-5 border-t border-[#e2e8e4] text-center text-xs text-[#4a5d56]">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-[#153b35] underline hover:opacity-80"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Portal links note */}
        <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-[#4a5d56]">
          <span>Preview access:</span>
          <Link href="/dashboard" className="text-[#153b35] underline font-medium">
            Citizen Dashboard
          </Link>
          <span>•</span>
          <Link href="/admin" className="text-[#153b35] underline font-medium">
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
