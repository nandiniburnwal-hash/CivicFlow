'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CIVIC_CATEGORIES } from '@/lib/mock-data';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Send,
  PlusCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

export default function ReportIssuePage() {
  const [category, setCategory] = useState<string>('Roads & Potholes');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router=useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!title.trim() || !location.trim() || !description.trim()) {
      setErrorMessage('Please fill in all required fields marked with *');
      return;
    }

    setIsSubmitting(true);

    try{
      const token=localStorage.getItem('access_token');

      //If token is not valid, redirect the user to login page
      if(!token){
        router.replace('/login');
        return;
      }


      //Fetch the response from the api request
      const response=await fetch(`${API_BASE_URL}/issues`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          title:title.trim(),
          description:description.trim(),
          category,
          location:location.trim()
        }),
      });

      //If response status is not ok, then return error
      if(!response.ok){
        const data=await response.json();
        throw new Error(
          Array.isArray(data.message)?
          data.message.join(', '):
          data.message || "Failed to submit report."
        )
      }

      setIsSubmitted(true);
    }catch(error){
      setErrorMessage(
        error instanceof Error?
        error.message : "Unable to submit report. Please try again."
      )
    }finally{
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setLocation('');
    setDescription('');
    setCategory('Roads & Potholes');
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6f0] text-[#153b35]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb / Back Link */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4a5d56] hover:text-[#153b35] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#153b35]">
              Report a Civic Issue
            </h1>
            <p className="mt-1 text-xs text-[#4a5d56]">
              Submit details of public infrastructure concerns for municipal review.
            </p>
          </div>

          {/* Success State */}
          {isSubmitted ? (
            <div className="rounded-xl bg-white p-6 sm:p-8 border border-[#b8d9cb] shadow-[0_1px_3px_0_rgba(21,59,53,0.04)] space-y-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#dcece5] text-[#153b35]">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#153b35]">
                  Issue Reported Successfully.
                </h2>
                <p className="mt-1.5 text-xs text-[#4a5d56] max-w-md mx-auto leading-relaxed">
                  Your issue has been submitted and saved successfully. You can track its status from your dashboard.
                </p>
              </div>

              <div className="rounded-lg bg-[#f7f6f0] p-4 border border-[#e2e8e4] text-left text-xs space-y-1.5 max-w-md mx-auto">
                <p>
                  <strong className="text-[#153b35]">Category:</strong>{' '}
                  <span className="text-[#4a5d56]">{category}</span>
                </p>
                <p>
                  <strong className="text-[#153b35]">Title:</strong>{' '}
                  <span className="text-[#4a5d56]">{title}</span>
                </p>
                <p>
                  <strong className="text-[#153b35]">Location:</strong>{' '}
                  <span className="text-[#4a5d56]">{location}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#153b35] bg-white border border-[#e2e8e4] hover:bg-[#f7f6f0] rounded-lg transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Another Report</span>
                </button>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-[#153b35] hover:bg-[#1c4d45] rounded-lg transition-colors"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            /* Main Form Card */
            <div className="rounded-xl bg-white p-6 sm:p-8 border border-[#e2e8e4] shadow-[0_1px_3px_0_rgba(21,59,53,0.04)]">
              {errorMessage && (
                <div className="mb-6 rounded-lg bg-[#fdf6ec] border border-[#fae5c3] p-3 text-xs text-[#9c6a1e] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#e7a84b]" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-xs font-semibold text-[#153b35] mb-1.5"
                  >
                    Category <span className="text-[#e7a84b]">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-[#e2e8e4] bg-[#f7f6f0]/50 px-3.5 py-2.5 text-xs text-[#153b35] focus:bg-white focus:border-[#153b35] focus:outline-none transition-colors"
                  >
                    {CIVIC_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Issue Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-xs font-semibold text-[#153b35] mb-1.5"
                  >
                    Issue Title <span className="text-[#e7a84b]">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Deep pothole causing hazard on right lane"
                    className="w-full rounded-lg border border-[#e2e8e4] bg-[#f7f6f0]/50 px-3.5 py-2.5 text-xs text-[#153b35] placeholder:text-[#4a5d56]/50 focus:bg-white focus:border-[#153b35] focus:outline-none transition-colors"
                  />
                </div>

                {/* Exact Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-xs font-semibold text-[#153b35] mb-1.5"
                  >
                    Exact Location <span className="text-[#e7a84b]">*</span>
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Near Metro Station Gate 3, 5th Main Road"
                    className="w-full rounded-lg border border-[#e2e8e4] bg-[#f7f6f0]/50 px-3.5 py-2.5 text-xs text-[#153b35] placeholder:text-[#4a5d56]/50 focus:bg-white focus:border-[#153b35] focus:outline-none transition-colors"
                  />
                  <p className="mt-1 text-[11px] text-[#4a5d56]">
                    Provide a street address, intersection, or recognizable landmark.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-xs font-semibold text-[#153b35] mb-1.5"
                  >
                    Description <span className="text-[#e7a84b]">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue, its severity, and how it impacts pedestrians or vehicles..."
                    className="w-full rounded-lg border border-[#e2e8e4] bg-[#f7f6f0]/50 px-3.5 py-2.5 text-xs text-[#153b35] placeholder:text-[#4a5d56]/50 focus:bg-white focus:border-[#153b35] focus:outline-none transition-colors resize-y"
                  />
                </div>

                {/* Required Fields Legend */}
                <p className="text-[11px] text-[#4a5d56]">
                  Fields marked with <span className="text-[#e7a84b]">*</span> are required for submission.
                </p>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#e2e8e4]">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-xs font-semibold text-[#4a5d56] hover:text-[#153b35] transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#153b35] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1c4d45] focus:outline-none transition-colors disabled:opacity-60"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Validating...' : 'Submit Report'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
