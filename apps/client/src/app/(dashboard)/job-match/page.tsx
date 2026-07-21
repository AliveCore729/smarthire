"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { jobMatchService } from "@/services/job-match-service";
import { Briefcase, Target, Loader2, CheckCircle2, XCircle, ChevronRight, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { motion } from "framer-motion";

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
        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">No Resume Found</h2>
        <p className="text-slate-400 mt-3 max-w-md">Please upload a resume on your Dashboard first to use the AI Job Match feature.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Semantic Job Matching</h1>
        <p className="text-slate-400 mt-2 font-light">Compare your active resume against a job description to find skill overlaps and gaps using AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Input Form */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <form onSubmit={handleAnalyze} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-slate-300 mb-3">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder:text-slate-600 transition-all min-h-[300px] resize-y custom-scrollbar"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={matchMutation.isPending || !jobDescription}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {matchMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Match...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  Calculate Match Score
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Results */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 flex flex-col relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          {!matchMutation.data ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 relative z-10">
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
                <Briefcase className="w-10 h-10 text-slate-500" />
              </div>
              <p className="max-w-xs font-light">Run an analysis to see the match score and skill gaps.</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative z-10">
              
              {/* Score Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <h3 className="text-xl font-display font-semibold text-white">Analysis Results</h3>
                  <p className="text-sm font-light text-slate-400 mt-1">Based on semantic comparison</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-300">Match Score</span>
                  <div className={`px-4 py-2 rounded-xl font-display font-bold text-2xl border ${
                    matchMutation.data.data.matchScore >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 
                    matchMutation.data.data.matchScore >= 60 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 
                    'bg-pink-500/10 border-pink-500/20 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                  }`}>
                    {matchMutation.data.data.matchScore}%
                  </div>
                </div>
              </div>

              {/* Matched Skills */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-5">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-4 tracking-wide">
                  <CheckCircle2 className="w-5 h-5" />
                  Matched Requirements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchMutation.data.data.matchedSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-1">
                      <ChevronRight className="w-3 h-3 opacity-50" />
                      {skill}
                    </span>
                  ))}
                  {matchMutation.data.data.matchedSkills.length === 0 && (
                    <span className="text-sm text-slate-400 font-light italic">No exact matches found.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-pink-500/5 border border-pink-500/10 rounded-xl p-5">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-pink-400 mb-4 tracking-wide">
                  <XCircle className="w-5 h-5" />
                  Missing Skills (Gaps)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchMutation.data.data.missingSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-pink-500/10 border border-pink-500/20 text-pink-300 rounded-lg text-xs font-medium flex items-center gap-1">
                      <ChevronRight className="w-3 h-3 opacity-50" />
                      {skill}
                    </span>
                  ))}
                  {matchMutation.data.data.missingSkills.length === 0 && (
                    <span className="text-sm text-slate-400 font-light italic">No missing skills detected!</span>
                  )}
                </div>
              </div>

            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}