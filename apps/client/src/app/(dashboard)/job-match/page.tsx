"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { jobMatchService } from "@/services/job-match-service";
import { Briefcase, Target, Loader2, CheckCircle2, XCircle, ChevronRight, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function JobMatchPage() {
  const { resume } = useAuthStore();
  const [jobDescription, setJobDescription] = useState("");

  const matchMutation = useMutation({
    mutationFn: () => jobMatchService.analyzeMatch({ resumeId: resume?.resume?._id || "", jobDescription }),
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume?.resume?._id || !jobDescription.trim()) return;
    matchMutation.mutate();
  };

  if (!resume) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">No Resume Found</h2>
        <p className="text-slate-500 mt-2">Please upload a resume on your Dashboard first to use the Job Match feature.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Semantic Job Matching</h1>
        <p className="text-slate-600 mt-2 font-medium">Compare your active resume against a job description to find skill overlaps and gaps using AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Input Form */}
        <div className="bg-white rounded-sm border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a] p-6 h-fit">
          <form onSubmit={handleAnalyze} className="space-y-5">
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full px-4 py-3 bg-pink-100 border-2 border-slate-900 rounded-sm text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:shadow-[4px_4px_0px_#0f172a] transition-all placeholder:text-slate-600 min-h-[250px] resize-y"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={matchMutation.isPending || !jobDescription}
              className="w-full py-3 bg-lime-300 text-slate-900 border-2 border-slate-900 rounded-sm font-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0f172a] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed uppercase"
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
        <div className="bg-sky-200 rounded-sm border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a] p-6 flex flex-col relative">
          {!matchMutation.data ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-900 font-bold">
              <div className="w-16 h-16 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] rounded-sm flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-slate-900" />
              </div>
              <p>Run an analysis to see the match score and skill gaps.</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Score Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase">Analysis Results</h3>
                  <p className="text-sm font-bold text-slate-700">Based on semantic comparison</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-slate-900 uppercase">Match Score</span>
                  <div className={`px-4 py-2 rounded-sm font-black text-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] ${
                    matchMutation.data.data.matchScore >= 80 ? 'bg-lime-300 text-slate-900' : 
                    matchMutation.data.data.matchScore >= 60 ? 'bg-amber-300 text-slate-900' : 
                    'bg-pink-300 text-slate-900'
                  }`}>
                    {matchMutation.data.data.matchScore}%
                  </div>
                </div>
              </div>

              {/* Matched Skills */}
              <div className="bg-white p-4 border-2 border-slate-900 rounded-sm shadow-[4px_4px_0px_#0f172a]">
                <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 mb-3 uppercase tracking-wide">
                  <CheckCircle2 className="w-5 h-5 text-slate-900 fill-lime-300" />
                  Matched Requirements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchMutation.data.data.matchedSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-lime-200 border-2 border-slate-900 text-slate-900 rounded-sm text-xs font-bold flex items-center gap-1 shadow-[2px_2px_0px_#0f172a] uppercase">
                      <ChevronRight className="w-3 h-3" />
                      {skill}
                    </span>
                  ))}
                  {matchMutation.data.data.matchedSkills.length === 0 && (
                    <span className="text-sm text-slate-600 font-bold italic">No exact matches found.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-white p-4 border-2 border-slate-900 rounded-sm shadow-[4px_4px_0px_#0f172a]">
                <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 mb-3 uppercase tracking-wide">
                  <XCircle className="w-5 h-5 text-slate-900 fill-pink-300" />
                  Missing Skills (Gaps)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchMutation.data.data.missingSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-pink-200 border-2 border-slate-900 text-slate-900 rounded-sm text-xs font-bold flex items-center gap-1 shadow-[2px_2px_0px_#0f172a] uppercase">
                      <ChevronRight className="w-3 h-3" />
                      {skill}
                    </span>
                  ))}
                  {matchMutation.data.data.missingSkills.length === 0 && (
                    <span className="text-sm text-slate-600 font-bold italic">No missing skills detected!</span>
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