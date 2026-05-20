"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { jobMatchService } from "@/services/job-match-service";
import { Briefcase, Target, Loader2, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

export default function JobMatchPage() {
  const [resumeId, setResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const matchMutation = useMutation({
    mutationFn: () => jobMatchService.analyzeMatch({ resumeId, jobDescription }),
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeId.trim() || !jobDescription.trim()) return;
    matchMutation.mutate();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Semantic Job Matching</h1>
        <p className="text-slate-500 mt-1">Compare a candidate's parsed resume against a job description to find skill overlaps and gaps.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Input Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
          <form onSubmit={handleAnalyze} className="space-y-5">
            <div>
              <label htmlFor="resumeId" className="block text-sm font-medium text-slate-700 mb-1">
                Target Resume ID
              </label>
              <input
                id="resumeId"
                type="text"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                placeholder="e.g., 65a4f..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                required
              />
              <p className="text-xs text-slate-500 mt-1.5">
                *In production, this would be a dropdown of the user's uploaded resumes.
              </p>
            </div>

            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-slate-700 mb-1">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 min-h-[250px] resize-y"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={matchMutation.isPending || !resumeId || !jobDescription}
              className="w-full py-2.5 bg-[#0F172A] text-white rounded-md font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {matchMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Match...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  Calculate Match Score
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Results */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col">
          {!matchMutation.data ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
              <Briefcase className="w-12 h-12 mb-3 text-slate-300" />
              <p>Run an analysis to see the match score and skill gaps.</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Score Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Analysis Results</h3>
                  <p className="text-sm text-slate-500">Based on semantic comparison</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-600">Match Score</span>
                  <div className={`px-4 py-2 rounded-lg font-bold text-xl ${
                    matchMutation.data.data.matchScore >= 80 ? 'bg-emerald-100 text-emerald-700' : 
                    matchMutation.data.data.matchScore >= 60 ? 'bg-amber-100 text-amber-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {matchMutation.data.data.matchScore}%
                  </div>
                </div>
              </div>

              {/* Matched Skills */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Matched Requirements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchMutation.data.data.matchedSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-emerald-200 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                      <ChevronRight className="w-3 h-3" />
                      {skill}
                    </span>
                  ))}
                  {matchMutation.data.data.matchedSkills.length === 0 && (
                    <span className="text-sm text-slate-500 italic">No exact matches found.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Missing Skills (Gaps)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchMutation.data.data.missingSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-red-200 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                      <ChevronRight className="w-3 h-3" />
                      {skill}
                    </span>
                  ))}
                  {matchMutation.data.data.missingSkills.length === 0 && (
                    <span className="text-sm text-slate-500 italic">No missing skills detected!</span>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}