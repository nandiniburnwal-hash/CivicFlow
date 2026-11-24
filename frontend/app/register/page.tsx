'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, ArrowRight } from 'lucide-react';
import { ToastNotification } from '@/components/ToastNotification';
import { API_BASE_URL } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ 
    title:string;
    message:string;
    type:'success' | 'error' | 'warning' | 'info';
   } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setToast(null);

    try {
      //fetch() sends a request to your NestJS backend
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',  //POST tels backend we're submitting data
        headers: {
          'Content-Type': 'application/json',  //tells NestJS that requesr body is of JSON type
        },
        body: JSON.stringify({  //stringify converts the JS obj into JSON text
          name,
          email,
          password,
        })
      });

      const data = await response.json();


      if (!response.ok) {
        const messages: string[] = Array.isArray(data.message) ? data.message : [data.message || "Registration failed. Please try again."];

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
            title: "Registration failed",
            message: messages.join(' '),
            type:'error',
          });
        }

        return;

      }

      setToast({
        title: "Registartion Successfull",
        message: "Your account has been created successfuly. You can now login.",
        type:'success',
      });


      //After successful registration, user sees the success message i.e.setToast() msg for 1sec then he is redirected to /login page
      setTimeout(() => {
        router.push('/login');
      }, 1000);

    } catch (error) {
      setToast({
        title: "Registration Failed",
        message: error instanceof Error ? error.message : "Something went wrong, please try again later " , //checks if the error occuring is js error, if yes then send the msg of the error, If no, then send a sentence
        type:'error',

      })
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
          Create Citizen Account
        </h1>
        <p className="mt-1 text-xs text-[#4a5d56]">
          Register to submit and monitor civic infrastructure reports.
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-xl bg-white p-6 sm:p-8 border border-[#e2e8e4] shadow-[0_1px_3px_0_rgba(21,59,53,0.04)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-[#153b35] mb-1.5"
              >
                Full Name <span className="text-[#e7a84b]">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Jane Doe"

                className={`w-full rounded-lg border ${fieldErrors.name
                  ? 'border-red-500'
                  : 'border-[#e2e8e4]'
                  } bg-[#f7f6f0]/50 px-3.5 py-2.5 text-xs text-[#153b35] placeholder:text-[#4a5d56]/50 focus:bg-white focus:outline-none transition-colors`}

              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#153b35] mb-1.5"
              >
                Email Address <span className="text-[#e7a84b]">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value),
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
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
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#153b35] mb-1.5"
              >
                Password <span className="text-[#e7a84b]">*</span>
              </label>
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
              <span>{isSubmitting ? 'Registering...' : 'Register'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 pt-5 border-t border-[#e2e8e4] text-center text-xs text-[#4a5d56]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#153b35] underline hover:opacity-80"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
